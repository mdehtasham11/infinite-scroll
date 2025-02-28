import React from "react";
import SearchBar from "./SearchBar";

function Navbar({setSearchData}) {
  return (
    <nav
      className="flex border border-blue-50 justify-between items-center h-16 text-black relative shadow-sm font-mono"
      role="navigation"
    >
      <div className="mx-3">Logo</div>
      <SearchBar setSearchData={setSearchData} />
      <ul className="flex items-center space-x-4 mx-4">
        <li>Gallery</li>
        <li>home</li>
        <li>About Us</li>
      </ul>
    </nav>
  );
}

export default Navbar;
