"use server";

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
import { nanoid } from "nanoid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

const client = new S3Client({ region: process.env.AWS_REGION });

export async function onSubmit(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  // console.log("Form data submitted", formData.get("file"));

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const fileKey = nanoid();
    // const client = new S3Client({ region: process.env.AWS_REGION });
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });

    const formDataS3 = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formDataS3.append(key, value as string);
    });

    const file = formData.get("file") as File;

    formDataS3.append("file", formData.get("file") as string);

    const response = await fetch(url, {
      method: "POST",
      body: formDataS3,
    });

    const textResponse = await response.text();

    if (response.ok) {
      console.log("File uploaded successfully", textResponse);

      // After a successful upload, save the file metadata to the database
      await prisma.file.create({
        data: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: fileKey,
          userId: userId,
        },
      });

      console.log("File metadata saved to database");
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
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const files = await prisma.file.findMany({
    where: {
      userId: userId,
    },
  });

  const imageUrls = await Promise.all(
    files.map(async (file) => {
      const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.url,
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
