import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { BasicLoader } from "../components/Loader";
import Error from "../components/Error";
import Card from "../components/Card";

const SearchResults = () => {
  // Değişkenler
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState(1);

  // URL'deki arama parametrelerine eriş
  const query = searchParams.get("search_query");

  useEffect(() => {
    // Eğer query boşsa API çağrısı yapma
    if (!query) return;

    setIsLoading(true);

    const params = { query, token: page > 1 ? token : undefined };

    // API çağrısını yap
    api
      .get("/search", { params })
      .then((res) => {
        // Veriyi doğru şekilde birleştirmek için önceki veriyi ekle
        // Eğer res.data.data bir array ise bu şekilde birleştirebilirsiniz
        setData((prev) => [...prev, ...res.data.data]); // verileri doğru şekilde birleştir
        setToken(res.data.continuation); // yeni token'ı güncelle
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [query, page]); // query ya da page değiştiğinde API çağrısı yapılır

  useEffect(() => {
    // query değiştiğinde sayfa 1'e eşitle
    setPage(1);
    // token'ı null'a eşitle
    setToken(null);
    // data'yı boşalt
    setData([]);
    // error'u boşalt
    setError(null);
    // API çağrısı yapılması için useEffect'i tekrar çalıştır
  }, [query]);

  return (
    <div className="rs p-4 sm:p-6 md:p-10 h-[93vh] overflow-y-auto ">
      <h2 className="text-xl mb-5 ">
        <span className="font-bold">{query} </span> için sonuçlar
      </h2>
      <div className="wrapper flex flex-col gap-5 justify-center">
        {error ? (
          <Error info={error} />
        ) : (
          data.map(
            (item) =>
              item.type === "video" && (
                <Card key={item.videoId} video={item} isRow={true} />
              )
          )
        )}
        {isLoading && <BasicLoader />}
      </div>
      <div className="flex justify-center mt-2">
        <button
          disabled={isLoading} // Eğer yükleniyorsa butonu pasiflestir
          onClick={() => setPage(page + 1)} // Sayfa arttıkça yeni veri al
          className={`bg-zinc-500 py-2 px-5  rounded-md my-10 hover:bg-zinc-700 transition cursor-pointer`}
        >
          Daha Fazla
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
