"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("File uploaded successfully!");
    } else {
      alert("Failed to upload file.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleUpload}>
      <Input
        className="border-2 hover:cursor-pointer"
        type="file"
        onChange={handleFileChange}
        required
      />
      {/* <input type="file" onChange={handleFileChange} required /> */}
      <Button type="submit">Upload</Button>
    </form>
  );
}
