import "./App.css";
import Gallery from "./Components/gallery/Gallery";
import Navbar from "./Components/navbar/Navbar";
import Footer from "./Components/footer/Footer";
import { useState } from "react";

function App() {
  const [searchData, setSearchData] = useState("");

  return (
    <>
      <Navbar setSearchData={setSearchData} />
      <div className="m-4 ">
        <Gallery searchData={searchData} />
      </div>
      <Footer />
    </>
  );
}

export default App;
