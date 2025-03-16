import React from "react";

const About = () => {
  return (
    <div className="p-8 bg-white">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        About Us
      </h2>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Welcome to <span className="font-bold text-blue-600">MyGallery</span>,
          your go-to destination for stunning visuals and creative inspiration.
          Our mission is to bring you the best in photography, art, and design,
          curated from talented creators around the world.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Whether you're here to explore, discover, or simply enjoy the beauty
          of visual storytelling, we're thrilled to have you with us. Join our
          community and let your creativity soar!
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default About;
