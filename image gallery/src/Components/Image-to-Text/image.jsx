import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import OpenAI from "openai";

// Initialize OpenAI client with Nebius API
const openai = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey:
    "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNDM4MjE5NzY1NzY5ODQ1MDg5MyIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTg5OTgzODMyNiwidXVpZCI6IjViZTM4ZDFkLTRlYjMtNGRjNy1hNTRmLWNjMzlkZGNlMmVmNCIsIm5hbWUiOiJpbWFnZS1nZW5lcmF0aW9uIiwiZXhwaXJlc19hdCI6IjIwMzAtMDMtMTVUMjA6NTI6MDYrMDAwMCJ9.io4jLb7ff3y5OXmNadeU9WKg66Aejr9DMn9N-tCeZHU",
  dangerouslyAllowBrowser: true,
});

function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before new request
    setImageUrl(""); // Reset image URL before new request
    generateImage(text);
  };

  const generateImage = async (prompt) => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const response = await openai.images.generate({
        model: "black-forest-labs/flux-schnell", // Use Flux model
        prompt,
        n: 1,
        size: "1024x1024",
      });

      const imageUrl = response.data?.[0]?.url;
      if (imageUrl) {
        setImageUrl(imageUrl);
      } else {
        throw new Error("No image URL returned");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex justify-center"
      >
        <div className="flex items-center w-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100">
          <input
            type="text"
            placeholder="Enter image description..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 leading-tight outline-none"
          />
          <button
            type="submit"
            className={`p-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Generating..." : <FaSearch className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Image Display */}
      <div className="border border-blue-600 h-96 w-1/2 flex items-center justify-center mt-10">
        {loading ? (
          <p className="text-gray-500">Generating image...</p>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated"
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="text-gray-500">No image generated</p>
        )}
      </div>
    </div>
  );
}

export default ImageGenerator;
