"use server";

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
import { nanoid } from "nanoid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({ region: process.env.AWS_REGION });

export async function onSubmit(formData: FormData) {
  // console.log("Form data submitted", formData.get("file"));
  try {
    // const client = new S3Client({ region: process.env.AWS_REGION });
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: nanoid(),
    });

    const formDataS3 = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formDataS3.append(key, value as string);
    });

    formDataS3.append("file", formData.get("file") as string);

    const response = await fetch(url, {
      method: "POST",
      body: formDataS3,
    });

    const textResponse = await response.text();

    if (response.ok) {
      console.log("File uploaded successfully", textResponse);
    } else {
      console.error("Failed to upload file", textResponse);
    }

    // console.log("URL", url);
    // console.log("fields", fields);
  } catch (error) {
    console.error("An error occurred", error);
  }
}

export async function listImages() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME,
  });

  const response = await client.send(command);
  const imageUrls = await Promise.all(
    (response.Contents || []).map(async (item) => {
      const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: item.Key,
      });
      const url = await getSignedUrl(client, getObjectCommand, {
        expiresIn: 3600,
      });
      return url;
    }),
  );

  return imageUrls;
}

export async function getDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return url;
}
