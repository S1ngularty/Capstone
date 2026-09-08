import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../core/configs/env.config.js";

class R2Client {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = env.r2.bucketName;

    this.client = new S3Client({
      region: "auto",

      endpoint: env.r2.s3Api,
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.r2.accessKeyId,
        secretAccessKey: env.r2.secretAccessKey,
      },
    });
  }

  async createUploadUrl(
    storageKey: string,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      ContentType: contentType,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: 300,
    });
  }

  async createDownloadUrl(
    storageKey: string,
    expiresIn = 300,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    return getSignedUrl(this.client, command, {
      expiresIn,
    });
  }

  async deleteObject(storageKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    await this.client.send(command);
  }
}

export const r2Client = new R2Client();
