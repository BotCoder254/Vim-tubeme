import { BiLike, BiDislike } from "react-icons/bi";
import millify from "millify";

const Channel = ({ video }) => {
  return (
    <div className="flex justify-between max-sm:flex-col">
      {/* sol taraf */}
      <div className="flex item-center gap-2 sm:gap-4 max-sm:justify-between">
        <div className="flex gap-2 sm:gap-4 items-center">
          <img
            className="rounded-full size-10 sm:size-12 "
            src={video.channelThumbnail?.[0]?.url}
            alt=""
          />
          <div>
            <h4 className="font-bold text-[#e7e7e7] line-clamp-1">
              {video.channelTitle}
            </h4>
            <p className="text-[#8d8d8d] ">{video.subscriberCountText}</p>
          </div>
        </div>
        <button className="bg-[#f1f1f1] text-[#0f0f0f] px-4 py-2 sm:py-2 m-5 hover:bg-[#e8e6e6de] transition rounded-full font-medium">
          Abone ol
        </button>
      </div>
      {/* Sağ Taraf */}
      <div className="flex gap-4 sm:gap-2.5">
        {/* Like Butonu */}
        <div className="flex items-center gap-2 sm:gap-1 bg-[#2e2e2e] rounded-full cursor-pointer max-sm:mt-1 max-sm:w-fit sm:my-3 sm:py-2 sm:px-4 transition-all duration-300 ease-in-out md:mt-[20px]  ">
          <div className="flex items-center gap-2 px-3 py-2 md:-m-3 rounded-full hover:bg-[#3f3e3e] transition duration-200">
            <BiLike className="text-[18px] sm:text-[20px] text-[#f1f1f1]" />
            <span className="text-[14px] sm:text-[15px] text-[#fdfcfc] font-semibold">
              {millify(video.likeCount || 0)}
            </span>
          </div>

          {/* İnce Çizgi */}
          <div className="h-6 border-l border-[#827f7f] mx-2"></div>

          {/* Dislike Butonu */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#3f3e3e] transition duration-200">
            <BiDislike className="text-[18px] sm:text-[20px] text-[#f1f1f1]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channel;
