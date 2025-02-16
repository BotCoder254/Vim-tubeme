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
      navigate(`/results?search_query=${text}`);
    }
  };

  return (
    <header className="flex justify-between items-center px-2 py-3 sm:px-4 border-b border-zinc-800">
      <Link 
        className="flex items-center gap-2 min-w-[100px]" 
        to={"/?v=Anasayfa"}
      >
        <img 
          className="w-8 sm:w-10" 
          src="/youtube.png" 
          alt="YouTube Logo" 
        />
        <h1 className="text-lg sm:text-xl font-roboto hidden sm:block">
          Vim Tube
        </h1>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="flex border border-zinc-700 rounded-[20px] overflow-hidden flex-1 mx-2 sm:mx-4 max-w-[600px]"
      >
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-2 sm:px-6 bg-black outline-none py-1 text-white w-full border border-transparent rounded-l-[20px] focus:border-blue-300 text-sm sm:text-base"
          type="text"
          placeholder="Vim Search"
        />
        <button
          className="px-2 sm:px-4 text-lg sm:text-2xl bg-zinc-800 hover:bg-zinc-700 transition duration-300"
          type="submit"
        >
          <IoIosSearch />
        </button>
      </form>

      <div className="w-[100px]" /> {/* Spacer for balance */}
    </header>
  );
};

export default Header;
