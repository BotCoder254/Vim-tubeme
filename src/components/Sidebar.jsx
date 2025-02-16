import { Link } from "react-router-dom";
import { categories } from "../constants";

const Sidebar = ({ selectedCat }) => {
  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex flex-col p-1 md:p-4 sidebar">
        {categories.map((i) => (
          <Link key={i.name} to={i.path == "/" ? "/" : `/?category=${i.path}`}>
            <div
              className={`flex items-center gap-2 py-4 px-2 md:px-3 md-text-lg cursor-pointer rounded-md hover:bg-[#2d2d2d] transition ${
                (i.path === selectedCat || (i.path === "/" && !selectedCat)) &&
                "bg-[#242424] "
              }`}
            >
              <span className="max-md:text-2xl">{i.icon}</span>
              <span className="max-md:hidden">{i.name}</span>
            </div>
            {i.divider && <hr />}
          </Link>
        ))}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-icons">
          {categories.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              to={item.path === "/" ? "/" : `/?category=${item.path}`}
              className="mobile-nav-icon"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
