import { AiFillHome, AiOutlineFlag } from "react-icons/ai";
import { MdLocalFireDepartment, MdLiveTv } from "react-icons/md";
import { CgMusicNote } from "react-icons/cg";
import { FiFilm } from "react-icons/fi";
import { IoGameControllerSharp } from "react-icons/io5";
import { ImNewspaper } from "react-icons/im";
import { GiDiamondTrophy, GiEclipse } from "react-icons/gi";
import { RiLightbulbLine, RiFeedbackLine } from "react-icons/ri";
import { FiSettings, FiHelpCircle } from "react-icons/fi";

// Kategoriler
export const categories = [
  { name: "Home", icon: <AiFillHome />, path: "/" },
  {
    name: "Trending",
    icon: <MdLocalFireDepartment />,
    path: "trending",
  },
  {
    name: "Music",
    icon: <CgMusicNote />,
    path: "music",
  },
  { name: "Movies", icon: <FiFilm />, path: "movies" },
  { name: "Live", icon: <MdLiveTv />, path: "live" },
  {
    name: "Gaming",
    icon: <IoGameControllerSharp />,
    path: "gaming",
  },
  {
    name: "News",
    icon: <ImNewspaper />,
    path: "news",
  },
  {
    name: "Sports",
    icon: <GiDiamondTrophy />,
    path: "sports",
  },
  {
    name: "Learning",
    icon: <RiLightbulbLine />,
    path: "learning",
  },
  {
    name: "Beauty & Cosmetics",
    icon: <GiEclipse />,
    path: "beauty",
    divider: false,
  },
  // { name: "Settings", icon: <FiSettings />, type: "menu" },
  // {
  //   name: "Report History",
  //   icon: <AiOutlineFlag />,
  //   type: "menu",
  // },
  // { name: "Help", icon: <FiHelpCircle />, type: "menu" },
  // {
  //   name: "Send Feedback",
  //   icon: <RiFeedbackLine />,
  //   type: "menu",
  // },
];
