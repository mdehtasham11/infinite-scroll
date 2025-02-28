import React from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon

const SearchBar = ({ setSearchData }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const handleSubmit = (event) => {
    setSearchData(search);
  };
  return (
    <div className="border border-blue-100 rounded-md flex items-center">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={handleSearch}
        className="rounded-md p-1 outline-none flex-grow"
      />
      <button onClick={handleSubmit} className=" p-1 rounded-md">
        <FaSearch /> {/* Use the search icon */}
      </button>
    </div>
  );
};

export default SearchBar;
