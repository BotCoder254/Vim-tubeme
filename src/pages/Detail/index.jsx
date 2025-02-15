import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api";
import ReactPlayer from "react-player";
import Channel from "./Channel";
import Description from "./Description";
import Comments from "./Comments";
import { BasicLoader } from "../../components/Loader";
import Error from "../../components/Error";
import Card from "../../components/Card";

const Detail = () => {
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [token, setToken] = useState(null);
  const observer = useRef();
  const lastVideoRef = useRef();

  //arama parametrelerine erişim için kurulum
  const [searcParams] = useSearchParams();

  //url`deki "v" isimli parametreye eriş
  const id = searcParams.get("v");

  const loadMoreSuggested = useCallback(async () => {
    if (isLoadingMore || !hasMore || !id) return;

    setIsLoadingMore(true);
    try {
      const params = { id, extend: 1, token };
      const res = await api.get("/video/info", { params });
      
      const newVideos = res.data.relatedVideos.data || [];
      setSuggestedVideos(prev => [...prev, ...newVideos]);
      
      if (res.data.relatedVideos.continuation) {
        setToken(res.data.relatedVideos.continuation);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more videos:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [id, token, isLoadingMore, hasMore]);

  // Intersection Observer setup
  const lastVideoCallback = useCallback(node => {
    if (isLoadingMore) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreSuggested();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [isLoadingMore, hasMore, loadMoreSuggested]);

  const checkVideoAvailability = async () => {
    try {
      const response = await fetch(`http://localhost:5000/info?videoId=${id}`);
      if (!response.ok) {
        throw new Error('Failed to check video availability');
      }
      const data = await response.json();
      
      if (!data.available) {
        throw new Error('Video is not available for download');
      }
      return data;
    } catch (err) {
      setDownloadStatus({
        type: 'error',
        message: err.message || 'Failed to check video availability'
      });
      return null;
    }
  };

  const handleDownload = async (format) => {
    if (!id) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus({
      type: 'info',
      message: 'Checking video availability...'
    });

    try {
      // Check if video is available for download
      const videoInfo = await checkVideoAvailability();
      if (!videoInfo) {
        setIsDownloading(false);
        return;
      }

      setDownloadStatus({
        type: 'info',
        message: `Starting ${format} download...`
      });

      // Create download URL
      const downloadUrl = `http://localhost:5000/download?videoId=${id}&format=${format}`;
      
      // Start download using fetch
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the content length for progress calculation
      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength, 10) || 0;
      
      // Create a reader to read the stream
      const reader = response.body.getReader();
      let receivedLength = 0;
      
      // Create a new ReadableStream to process the download
      const stream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({done, value}) => {
              if (done) {
                controller.close();
                return;
              }
              receivedLength += value.length;
              if (total > 0) {
                const progress = (receivedLength / total) * 100;
                setDownloadProgress(Math.round(progress));
              }
              controller.enqueue(value);
              push();
            }).catch(error => {
              console.error('Stream error:', error);
              controller.error(error);
            });
          }
          push();
        }
      });
      
      // Create response from stream
      const newResponse = new Response(stream);
      const blob = await newResponse.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${videoInfo.title}.${format === 'audio' ? 'mp3' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setDownloadStatus({
        type: 'success',
        message: `${format === 'audio' ? 'Audio' : 'Video'} download completed! Check your downloads folder.`
      });
    } catch (err) {
      setDownloadStatus({
        type: 'error',
        message: `Failed to download ${format}. ${err.message}`
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  //id`si bilinen video bilgilerini al
  useEffect(() => {
    if (!id) return;

    const params = { id, extend: 1 };
    api
      .get(`/video/info`, { params })
      .then((res) => {
        // video bilgilerini state'e aktar
        setVideo(res.data);
        setSuggestedVideos(res.data.relatedVideos?.data || []);
        setToken(res.data.relatedVideos?.continuation);
        setHasMore(!!res.data.relatedVideos?.continuation);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div className="detail-page h-screen overflow-auto">
      <div className="page-content ">
        {/* video içeriği */}
        <div>
          {/* video */}
          <div className="h-[30vh] md:h-[50vh] lg:h-[60vh] rounded overflow-hidden ">
            <ReactPlayer
              height={"100%"}
              width={"100%"}
              controls
              url={`https://www.youtube.com/watch?v=${id}`}
            />
          </div>
          {/* açıklamalar */}
          {error ? (
            <Error info={error} />
          ) : !video ? (
            <BasicLoader />
          ) : (
            <div>
              {/* Başlık ve Download Buttons */}
              <div className="my-3 space-y-4">
                <h1 className="text-xl font-bold">{video.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload('audio')}
                    disabled={isDownloading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                  >
                    {isDownloading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Downloading... {downloadProgress > 0 ? `${downloadProgress}%` : ''}</span>
                      </>
                    ) : (
                      'Download Audio (MP3)'
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload('video')}
                    disabled={isDownloading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                  >
                    {isDownloading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Downloading... {downloadProgress > 0 ? `${downloadProgress}%` : ''}</span>
                      </>
                    ) : (
                      'Download Video (MP4)'
                    )}
                  </button>
                </div>
                
                {/* Download Progress Bar */}
                {isDownloading && downloadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              {/* Download Status */}
              {downloadStatus && (
                <div className={`mt-2 text-sm ${
                  downloadStatus.type === 'error' 
                    ? 'text-red-500' 
                    : downloadStatus.type === 'success'
                    ? 'text-green-500'
                    : 'text-blue-500'
                } bg-opacity-10 p-2 rounded`}>
                  {downloadStatus.message}
                </div>
              )}

              {/* kanal bilgileri */}
              <Channel video={video} />
              {/*açıklama */}
              <Description video={video} />
              {/* yorumlar */}
              <Comments videoId={id} />
            </div>
          )}
        </div>

        {/* önerilen videolar */}
        <div className="flex flex-col gap-5 p-1">
          {suggestedVideos.map((item, index) => {
            if (item.type !== "video") return null;
            
            if (index === suggestedVideos.length - 1) {
              return (
                <div ref={lastVideoCallback} key={item.videoId}>
                  <Card video={item} isRow={true} />
                </div>
              );
            }
            
            return <Card key={item.videoId} video={item} isRow={true} />;
          })}
          {isLoadingMore && <BasicLoader />}
        </div>
      </div>
    </div>
  );
};

export default Detail;
