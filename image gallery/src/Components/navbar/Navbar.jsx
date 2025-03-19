import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center h-16 px-6 shadow-md bg-white font-mono border-b border-gray-200">
      {/* Logo Section */}
      <div className="text-lg font-bold text-blue-600">Logo</div>

      {/* Navigation Links */}
      <ul className="flex items-center space-x-6 text-gray-700">
        <li>
          <NavLink
            to="/"
            className="hover:text-blue-500 transition-colors duration-200"
            activeClassName="text-blue-600 font-bold"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/gallery"
            className="hover:text-blue-500 transition-colors duration-200"
            activeClassName="text-blue-600 font-bold"
          >
            Gallery
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/image"
            className="hover:text-blue-500 transition-colors duration-200"
            activeClassName="text-blue-600 font-bold"
          >
            Generate Images
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="hover:text-blue-500 transition-colors duration-200"
            activeClassName="text-blue-600 font-bold"
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
