import React from "react";
import SearchBar from "./SearchBar";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="flex border border-blue-50 justify-between items-center h-16 text-black relative shadow-sm font-mono"
      role="navigation"
    >
      <div className="mx-3">Logo</div>
      <SearchBar />
      <ul className="flex items-center space-x-4 mx-4">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/gallery">Galley</NavLink>
        </li>
        <li>
          <NavLink>About</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
