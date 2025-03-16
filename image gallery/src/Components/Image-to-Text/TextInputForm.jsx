import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
function TextInputForm({ onGenerateImage }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateImage(text);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto justify-center mt-20"
      >
        <div className="flex items-center  rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <input
            type="text"
            placeholder="Search..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 leading-tight  outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaSearch className="w-5 h-5" /> {/* Use the search icon */}
          </button>
        </div>
      </form>
    </>
  );
}

export default TextInputForm;
