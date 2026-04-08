import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SearchBar from "../navbar/SearchBar";
import { FaHeart, FaDownload, FaExpand } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import throttle from "lodash/throttle";

function GalleryCard({ image, liked, onLike, onDownload }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        breakInside: "avoid",
        marginBottom: "3px",
        overflow: "hidden",
        outline: hovered ? "1px solid var(--gold)" : "1px solid transparent",
        transition: "outline-color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={image.urls.regular}
        alt={image.alt_description || "Image"}
        loading="lazy"
        style={{ width: "100%", height: "auto", display: "block", opacity: hovered ? 1 : 0.9, transition: "opacity 0.3s" }}
      />
      {hovered && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,11,9,0.75) 0%, transparent 55%)" }} />
          {image.user && (
            <div style={{ position: "absolute", bottom: "8px", left: "10px", fontFamily: "var(--font-mono)", fontSize: "7px", letterSpacing: "1px", color: "rgba(245,240,232,0.55)", textTransform: "uppercase" }}>
              {image.user.name}
            </div>
          )}
          <div style={{ position: "absolute", top: "6px", right: "6px", display: "flex", flexDirection: "column", gap: "3px" }}>
            <button
              onClick={onLike}
              style={{ width: "26px", height: "26px", background: liked ? "var(--gold)" : "rgba(12,11,9,0.85)", border: `1px solid ${liked ? "var(--gold)" : "var(--border)"}`, color: liked ? "var(--bg)" : "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "10px" }}
            >
              {liked ? <FaHeart /> : <CiHeart />}
            </button>
            <button
              onClick={onDownload}
              style={{ width: "26px", height: "26px", background: "rgba(12,11,9,0.85)", border: "1px solid var(--border)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "10px" }}
            >
              <FaDownload />
            </button>
            <button
              onClick={() => window.open(image.urls.full, "_blank")}
              style={{ width: "26px", height: "26px", background: "rgba(12,11,9,0.85)", border: "1px solid var(--border)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "10px" }}
            >
              <FaExpand />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Gallery() {
  const searchData = useSelector((state) => state.search.searchData);
  const [images,      setImages]      = useState([]);
  const [page,        setPage]        = useState(1);
  const [isLoading,   setIsLoading]   = useState(false);
  const [likedImages, setLikedImages] = useState(new Set());
  const ACCESS_KEY = "pPAAKdRDW1Bdnbb8JSuudEmMxxi5KGu2EucdXqEDNW8";

  const handleLike = (id) =>
    setLikedImages((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const fetchImages = async (pg) => {
    setIsLoading(true);
    try {
      const url = searchData
        ? `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&per_page=12&query=${searchData}&page=${pg}`
        : `https://api.unsplash.com/photos/?client_id=${ACCESS_KEY}&per_page=16&page=${pg}`;
      const { data } = await axios.get(url);
      const incoming = searchData ? data.results : data;
      setImages((prev) => [...prev, ...incoming.filter((img) => !prev.some((p) => p.id === img.id))]);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { setImages([]); setPage(1); }, [searchData]);
  useEffect(() => { fetchImages(page); }, [page]);

  const handleScroll = useCallback(
    throttle(() => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 200)
        setPage((p) => p + 1);
    }, 1000),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const downloadImage = async (url, filename) => {
    try {
      const blob = await (await fetch(url)).blob();
      const a = Object.assign(document.createElement("a"), {
        href: window.URL.createObjectURL(blob),
        download: filename,
      });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="label-mono" style={{ marginBottom: "6px" }}>Browse Collection</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "32px", color: "var(--text)" }}>
            Image Gallery
          </h1>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "2px" }}>
          {images.length} images loaded
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 32px", borderBottom: "1px solid var(--border)" }}>
        <SearchBar />
        {searchData && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px", marginTop: "10px" }}>
            Results for <span style={{ color: "var(--gold)" }}>"{searchData}"</span>
          </p>
        )}
      </div>

      {/* Grid */}
      <div style={{ padding: "3px" }}>
        {images.length === 0 && !isLoading ? (
          <div style={{ textAlign: "center", padding: "80px 32px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "48px", color: "var(--text-dim)", marginBottom: "16px" }}>✦</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "24px", color: "var(--text-muted)", marginBottom: "8px" }}>No Images Found</h3>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-dim)", letterSpacing: "1px" }}>Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5" style={{ columnGap: "3px" }}>
            {images.map((image) => (
              <GalleryCard
                key={image.id}
                image={image}
                liked={likedImages.has(image.id)}
                onLike={() => handleLike(image.id)}
                onDownload={() => downloadImage(image.urls.full, `image-${image.id}.jpg`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px", gap: "12px" }}>
          <div style={{ width: "28px", height: "28px", border: "1px solid var(--border)", borderTop: "1px solid var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase" }}>Loading</span>
        </div>
      )}
    </div>
  );
}

export default Gallery;
