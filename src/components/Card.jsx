import millify from "millify";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BsFillPlayFill } from "react-icons/bs";

const Card = ({ video, isRow }) => {
  const [isHover, setIsHover] = useState(false);

  // Kapak fotoğrafı
  const thumbnail =
    isHover && !video.isLive && video.richThumbnail
      ? video.richThumbnail[0].url
      : video.thumbnail[video.thumbnail.length - 1].url;

  // Kanal fotoğrafı
  const channelPic = video?.channelThumbnail?.[0]?.url;

  console.log(video);

  return (
    <Link
      to={`/watch?v=${video.videoId}`}
      className={`${isRow ? "row" : "col"} max-w-[360px] w-full`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* Resim alanı */}
      <div className="aspect-video relative group">
        <img className="rounded-lg w-full h-full object-cover" src={thumbnail} alt="" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0  hover:opacity-200 transition-opacity">
          <BsFillPlayFill className="text-blue-500 text-6xl hover:text-blue-600 cursor-pointer bg-white/80 rounded-full p-2" />
        </div>
      </div>

      {/* Alt detay alanı */}
      <div className="flex gap-4">
        <img className="size-14 rounded-full pp" src={channelPic} alt="" />
        <div>
          <h4 className="font-bold text-[#e7e7e7] line-clamp-2 pt-8">
            {video?.title}
          </h4>
          <div className="text-[#aaaaaa] mt-1.5 ">
            <p>{video?.channelTitle}</p>
            <div className="flex gap-1 items-center">
              <p>
                <span>{millify(video?.viewCount || 0)}</span>
                <span className="text-sm sm-1 ml-1 views">Görüntülenme</span>
              </p>
              <span className="text-2xl mt-0 items-center">·</span>
              {video?.isLive ? (
                <p className="bg-[#cf042a] py-0.5 px-2 rounded-lg text-[#ffffff] font-medium">
                  Canlı
                </p>
              ) : (
                <p>{video?.publishedTimeText}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
