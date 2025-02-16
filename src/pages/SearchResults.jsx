import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { BasicLoader } from "../components/Loader";
import Error from "../components/Error";
import Card from "../components/Card";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [token, setToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const lastVideoRef = useRef();

  // URL'deki arama parametrelerine eriş
  const query = searchParams.get("search_query");

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const params = { query, token };
      const res = await api.get("/video/search", { params });
      
      const newData = res.data.data;
      setData(prev => [...prev, ...newData]);
      
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
  }, [query, token, isLoading, hasMore]);

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
    if (!query) return;

    setIsLoading(true);
    setData([]);
    setToken(null);
    setHasMore(true);
    setError(null);

    const params = { query };
    api.get("/video/search", { params })
      .then((res) => {
        setData(res.data.data);
        setToken(res.data.continuation);
        setHasMore(!!res.data.continuation);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [query]);

  return (
    <div className="rs p-4 sm:p-6 md:p-8 h-[93vh] overflow-y-auto">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-xl mb-6 text-center">
          <span className="font-bold">{query}</span> 
        </h2>
        <div className="wrapper flex flex-col gap-6 items-stretch">
          {error ? (
            <Error info={error} />
          ) : (
            data.map((item, index) => {
              if (item.type !== "video") return null;
              
              const videoElement = (
                <div className="w-full max-w-[1000px] mx-auto hover:bg-zinc-800/40 rounded-xl p-3 transition-all">
                  <Card video={item} isRow={true} />
                </div>
              );
              
              // Add ref to last item
              if (index === data.length - 1) {
                return (
                  <div ref={lastVideoCallback} key={item.videoId}>
                    {videoElement}
                  </div>
                );
              }
              
              return <div key={item.videoId}>{videoElement}</div>;
            })
          )}
          {isLoading && <BasicLoader />}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
