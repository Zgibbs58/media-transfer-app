"use client";

import React, { useEffect, useState } from "react";
import { listImages, getDownloadUrl } from "./actions"; // Adjust the import path as necessary
import { Button } from "@/components/ui/button";

const ImageGrid = () => {
  const [images, setImages] = useState<{ url: string; key: string }[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const imageList = await listImages();
      setImages(imageList);
    }

    fetchImages();
  }, []);

  // const handleDownload = async (key: string) => {
  //   console.log("Key passed to handleDownload:", key);
  //   const url = await getDownloadUrl(key);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = key; // You can set a custom filename here
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownload = async (key: string) => {
    const url = await getDownloadUrl(key);

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;

    // Extract the file name from the key or set a default name
    const fileName = key.split("/").pop() || "downloaded-image";

    // Set the download attribute with the filename
    link.download = fileName;

    // Append the link to the document body, trigger click, and then remove it
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
      {images.map((image, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            src={image.url}
            alt={`Image ${index}`}
            style={{ width: "100%", height: "auto" }}
          />
          <Button
            onClick={() => handleDownload(image.key)}
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
