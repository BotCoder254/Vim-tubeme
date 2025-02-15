import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { useEffect, useState, useCallback, useRef } from "react";
import api from "../api/index";
import Loader from "../components/Loader";
import Error from "../components/Error";

const Feed = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const lastVideoRef = useRef();

  const [searchParams] = useSearchParams();
  const selectedCat = searchParams.get("category");

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const url = !selectedCat
        ? "/home"
        : selectedCat === "tranding"
        ? "/tranding"
        : `/search?query=${selectedCat}`;

      const params = token ? { token } : {};
      const res = await api.get(url, { params });
      
      const newVideos = res.data.data;
      setVideos(prev => [...prev, ...newVideos]);
      
      if (res.data.continuation) {
        setToken(res.data.continuation);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCat, token, isLoading, hasMore]);

  // Intersection Observer setup
  const lastVideoCallback = useCallback(node => {
    if (isLoading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore, loadMore]);

  // Initial load
  useEffect(() => {
    const url = !selectedCat
      ? "/home"
      : selectedCat === "tranding"
      ? "/tranding"
      : `/search?query=${selectedCat}`;

    setIsLoading(true);
    setVideos([]);
    setToken(null);
    setHasMore(true);
    setError(null);

    api
      .get(url)
      .then((res) => {
        setVideos(res.data.data);
        setToken(res.data.continuation);
        setHasMore(!!res.data.continuation);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [selectedCat]);

  return (
    <div className="flex">
      <Sidebar selectedCat={selectedCat} />
      <div className="flex-1 overflow-y-auto h-[93vh]">
        <div className="videos">
          {error ? (
            <Error info={error} />
          ) : (
            videos.map((item, index) => {
              if (item.type !== "video") return null;
              
              if (index === videos.length - 1) {
                return (
                  <div ref={lastVideoCallback} key={item.videoId}>
                    <Card video={item} />
                  </div>
                );
              }
              
              return <Card key={item.videoId} video={item} />;
            })
          )}
          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default Feed;
