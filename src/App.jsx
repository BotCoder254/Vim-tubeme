import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Feed from "./pages/Feed";
import Detail from "./pages/Detail/index";
import SearchResults from "./pages/SearchResults";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/results" element={<SearchResults />} />
        {/* Önce spesifik rotalar */}
        <Route path="/" element={<Feed />} /> {/* Sonra genel rotalar */}
        <Route path="watch" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
