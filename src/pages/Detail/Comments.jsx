import { useEffect, useState } from "react";
import api from "../../api";
import { BasicLoader } from "../../components/Loader";
import { BiDislike, BiLike } from "react-icons/bi";
import { SlArrowDown } from "react-icons/sl";

const Comments = ({ videoId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    api
      .get("/comments", { params: { id: videoId } })
      .then((res) => {
        console.log(res.data); // Gelen veri hakkında bilgi edinmek için konsola yazdır
        setComments(res.data); // Gelen veriyi state'e aktar
      })
      .catch((err) => console.log(err.message))
      .finally(() => setIsLoading(false));
  }, [videoId]);

  console.log(comments, isLoading);

  return (
    <div className="my-6">
      {isLoading ? (
        <BasicLoader />
      ) : (
        <>
          <h1 className="text-xl font-bold"> {comments.commentsCount} Yorum</h1>
          {/* Yorumlar listesini göstermek istersen */}
          <input
            type="text"
            className="w-full bg-transparent border-b border-[#4a4a4a] p-2 outline-none mb-5 "
            placeholder="Yorum ekleyin..."
          />
          {comments.data.map((i, index) => (
            <div
              key={index}
              className="flex gap-2 sm:gap-3 item-start px-1 py-3 sm:py-4"
            >
              <img
                src={i.authorThumbnail[0].url}
                className="rounded-full size-8 sm:size-10"
              />
              <div className="flex flex-col gap-2">
                <h5 className="flex gap-2 item-,">
                  <span className="font-semibold text-[14px] ">
                    {i.authorText}
                  </span>
                  <span className="text-[#888888] text-[15px] ">
                    {i.publishedTimeText}
                  </span>
                </h5>
                <p className="whitespace-pre-wrap">{i.textDisplay} </p>
                <div className="flex gap-5 items-center">
                  <div className="flex gap-1 items-center p-1 px-2 rounded-full cursor-pointer hover:bg-[#838383] ">
                    <BiLike />
                  </div>
                  <span className=" ml-[-17px] text-[12px] text-[#888888]">
                    {i.likesCount}
                  </span>
                  <div className="p-1 px-2 rounded-full cursor-pointer hover:bg-[#838383]">
                    <BiDislike />
                  </div>
                  <span className="p-1 px-2 rounded-full cursor-pointer hover:bg-[#838383] text-sm">
                    Yanıtla
                  </span>
                </div>
                {Number(i.replyCount) > 0 && (
                  <div className="flex w-fit item-center p-1 rounded-md gap-3 text-[#3ea6ff] text-[15px] ">
                    <span className=" mt-1 text-[12px] ">
                      <SlArrowDown />
                    </span>
                    {i.replyCount} yanıt
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
