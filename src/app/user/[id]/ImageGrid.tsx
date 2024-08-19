"use client";

import React, { useEffect, useState } from "react";
import { listImages, getDownloadUrl } from "./actions"; // Adjust the import path as necessary
import { Button } from "@/components/ui/button";

const ImageGrid = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const urls = await listImages();
      setImageUrls(urls);
    }

    fetchImages();
  }, []);

  const handleDownload = async (key: string) => {
    const url = await getDownloadUrl(key);
    const link = document.createElement("a");
    link.href = url;
    link.download = key; // You can set a custom filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "10px",
      }}
    >
      {imageUrls.map((url, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            src={url}
            alt={`Image ${index}`}
            style={{ width: "100%", height: "auto" }}
          />
          <Button
            onClick={() => handleDownload(url)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            Download
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
