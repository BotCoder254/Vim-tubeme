import { IoIosSearch } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search_query") || "";
  const [searchText, setSearchText] = useState(query);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = searchText.trim();
    if (text) {
      navigate(`/results?search_query=${encodeURIComponent(text)}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <header className="flex justify-between items-center px-2 py-4 sm:px-4">
      <Link className="flex items-center gap-2" to={"/?v=Anasayfa"}>
        <img className="w-10 sm:w-12" src="/youtube.png" alt="YouTube Logo" />
        <h1 className="text-xl sm:text-2xl font-roboto">YouTube</h1>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="flex border border-zinc-700 rounded-[20px] overflow-hidden"
      >
        <input
          value={searchText}
          onChange={handleSearchChange}
          className="px-3 sm:px-5 bg-black outline-none py-1 text-white border border-transparent rounded-l-[20px] focus:border-blue-300"
          type="text"
          placeholder="Ara"
        />
        <button
          className="px-3 sm:px-4 sm:text-2xl bg-zinc-800 hover:bg-zinc-600 transition duration-300 cursor-pointer"
          type="submit"
        >
          <IoIosSearch />
        </button>
      </form>

      <div className="flex gap-3 text-lg cursor-pointer max-sm:hidden">
        <FaBell className="hover:text-gray-400" />
        <FaVideo className="hover:text-gray-400" />
        <MdVideoLibrary className="hover:text-gray-400" />
      </div>
    </header>
  );
};

export default Header;
