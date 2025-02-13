import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import api from "../api/index";
import Loader from "../components/Loader";
import Error from "../components/Error";

const Feed = () => {
  const [videos, setVideos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const selectedCat = searchParams.get("category");

  useEffect(() => {
    //selectadcat null ise : /home
    //selectadcat tranding ise : /tranding
    //selectadcat tranding değilse :/search?query=DEĞER

    const url = !selectedCat
      ? "/home"
      : selectedCat === "tranding"
      ? "/tranding"
      : `/search?query=${selectedCat}`;

    setIsLoading(true);

    api
      .get(url)
      .then((res) => setVideos(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [selectedCat]);

  return (
    <div className="flex">
      <Sidebar selectedCat={selectedCat} />
      <div className="videos">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Error info={error} />
        ) : (
          videos.map(
            (i) => i.type === "video" && <Card key={i.videoId} video={i} />
          )
        )}
      </div>
    </div>
  );
};

export default Feed;
