import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../navbar/SearchBar";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-blue-500">
          Welcome to Image Gallery
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Discover and explore stunning images from Unsplash
        </p>
      </div>

      {/* Image Previews */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
        <img
          src="https://images.unsplash.com/photo-1741524915320-8fee76e41424?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDZ8TThqVmJMYlRSd3N8fGVufDB8fHx8fA%3D%3D"
          alt="random"
          className="rounded-lg shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1741017269648-44a2497aba20?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDh8Ym84alFLVGFFMFl8fGVufDB8fHx8fA%3D%3D"
          alt="random"
          className="rounded-lg shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1735238075870-2e74333c6c7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8cVBZc0R6dkpPWWN8fGVufDB8fHx8fA%3D%3D"
          alt="random"
          className="rounded-lg shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1616939750001-566f1e189f2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8cVBZc0R6dkpPWWN8fGVufDB8fHx8fA%3D%3D"
          alt="random"
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Explore Button */}
      <div className="mt-8">
        <Link to="/gallery">
          <button className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600">
            Explore Gallery
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
