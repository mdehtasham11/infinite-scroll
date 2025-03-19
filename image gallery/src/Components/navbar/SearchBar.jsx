import React from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import { useDispatch } from "react-redux";
import { setSearchData } from "../../redux/searchSlice";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission reload
    dispatch(setSearchData(search));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex items-center  rounded-lg overflow-hidden border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="y-700 leadw-full px-4 py-2 text-graing-tight outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaSearch className="w-5 h-5" /> {/* Use the search icon */}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
