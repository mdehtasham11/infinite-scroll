import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";


function Gallery() {
  const searchData = useSelector((state) => state.search.searchData);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const ACCESS_KEY = "pPAAKdRDW1Bdnbb8JSuudEmMxxi5KGu2EucdXqEDNW8";

  const handleScroll = () => {

    let timeout;
    setIsLoading(true);
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      const innerHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const bodyHeight = document.body.scrollHeight;
      if (innerHeight + scrollY >= bodyHeight) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 4000);
  };

  const fetchImages = async (page) => {
    try {
      if (!searchData) {
        const response = await axios.get(
          `https://api.unsplash.com/photos/?client_id=${ACCESS_KEY}&per_page=12&page=${page}`
        );
        setImages((prevImages) => [...prevImages, ...response.data]);
      } else {
        const searchResponse = await axios.get(
          `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&per_page=12&query=${searchData}&page=${page}`
        );
        setImages((prevImages) => {
          const newImages = searchResponse.data.results.filter(
            (image) =>
              !prevImages.some((prevImage) => prevImage.id === image.id)
          );
          return [...prevImages, ...newImages];
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchData && searchData.length > 0) {
      setImages([]);
      setPage(1);
    }
    fetchImages(page);
  }, [page, searchData]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="">
        <div className="container mx-auto">
          <h1 className="text-4xl text-blue-400 font-bold text-center mt-10">
            Image Gallery
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {images.map((image) => {
              return (
                <div
                  key={image.id}
                  className="rounded-lg overflow-hidden shadow-md border"
                >
                  <img
                    src={image.urls.regular}
                    alt={image.alt_description}
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 font-bold my-auto px-4 py-2">
                      {image.alt_description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isLoading && <p className="text-5xl">Loading Moree....</p>}
    </>
  );
}

export default Gallery;
