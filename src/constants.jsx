import { AiFillHome, AiOutlineFlag } from "react-icons/ai";
import { MdLocalFireDepartment, MdLiveTv } from "react-icons/md";
import { CgMusicNote } from "react-icons/cg";
import { FiFilm } from "react-icons/fi";
// import { IoGameControllerSharp } from "react-icons/io5";
import { SiRepublicofgamers ,SiScikitlearn } from "react-icons/si";
import { ImNewspaper } from "react-icons/im";
import { GiDiamondTrophy, GiEclipse ,GiLargeDress } from "react-icons/gi";
import { TiSocialYoutubeCircular } from "react-icons/ti";
import { RiLightbulbLine, RiFeedbackLine } from "react-icons/ri";
import { FiSettings, FiHelpCircle } from "react-icons/fi";
import { FcHome ,FcMusic,FcVideoCall ,FcNews ,FcSportsMode } from "react-icons/fc";
import { FaFire } from "react-icons/fa";
// Kategoriler
export const categories = [
  { name: "Home", icon: <FcHome />, path: "/" },
  {
    name: "Trending",
    icon: <FaFire />,
    path: "trending",
  },
  {
    name: "Music",
    icon: <FcMusic />,
    path: "music",
  },
  { name: "Movies", icon: <FcVideoCall />, path: "movies" },
  { name: "Live", icon: <TiSocialYoutubeCircular />, path: "live" },
  {
    name: "Gaming",
    icon: <SiRepublicofgamers />,
    path: "gaming",
  },
  {
    name: "News",
    icon: <FcNews />,
    path: "news",
  },
  {
    name: "Sports",
    icon: <FcSportsMode />,
    path: "sports",
  },
  {
    name: "Learning",
    icon: <SiScikitlearn />,
    path: "learning",
  },
  {
    name: "Beauty & Cosmetics",
    icon: <GiLargeDress />,
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
