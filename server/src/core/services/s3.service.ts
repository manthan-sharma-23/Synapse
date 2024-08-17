import { env } from "../config/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { extname } from "path";
import { lookup } from "mime-types";
class S3Service {
  private bucket_name = "manthan-bucket-1";
  private access_key_id = env.S3_ACCESS_KEY;
  private secret_access_key = env.S3_SECRET_ACCESS_KEY;
  private base_path = "synapse-storage";
  private bucket_region = "ap-south-1";
  private cloud_front_domain = env.CLOUD_FRONT_DOMAIN;

  public get_file_url(key: string) {
    return this.cloud_front_domain + key;
  }

  private file_key_generator({
    userId,
    roomId,
    fileName,
  }: {
    userId: number;
    roomId: string;
    fileName: string;
  }) {
    return `${this.base_path}/${roomId}/${userId}/${
      Math.random() * 100000
    }/${fileName}`;
  }

  public async generate_presigned_url({
    userId,
    roomId,
    fileName,
  }: {
    userId: number;
    roomId: string;
    fileName: string;
  }) {
    const key = this.file_key_generator({ userId, roomId, fileName });

    const contentType = lookup(extname(fileName)) || "application/octet-stream";

    const command = new PutObjectCommand({
      Bucket: this.bucket_name,
      Key: key,
      ContentType: contentType,
    });

    const s3_client = new S3Client({
      credentials: {
        accessKeyId: this.access_key_id,
        secretAccessKey: this.secret_access_key,
      },
      region: this.bucket_region,
    });

    //@ts-ignore
    const pre_sign_url = await getSignedUrl(s3_client, command, {
      expiresIn: 5 * 60,
    });

    const url = this.get_file_url(key);
    return { key, pre_sign_url, url, contentType };
  }
}

export default new S3Service();
