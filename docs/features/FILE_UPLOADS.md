# File Uploads

Synapse supports file uploads for images and videos through AWS S3 and CloudFront. This system allows efficient storage and delivery of media files.

## Process

1. **File Upload**:
   - Users upload files (images or videos) via the chat interface.
   - The client requests a pre-signed URL from the server to securely upload the file to S3.

2. **Pre-Signed URL**:
   - The server generates a pre-signed URL using AWS SDK.
   - This URL grants temporary access to upload the file directly to S3 without exposing credentials.

3. **Upload to S3**:
   - The client uses the pre-signed URL to upload the file to the designated S3 bucket.
   - Once uploaded, the file is stored securely in S3.

4. **Content Delivery**:
   - CloudFront is used as a CDN to distribute files efficiently.
   - The S3 bucket is configured as an origin for CloudFront, which caches and delivers the files quickly to users.

5. **File Reference**:
   - After upload, the file's URL is saved in the database and sent as part of the chat message.
   - Users can access the file through the CloudFront URL, ensuring fast and reliable delivery.

## Summary

- **S3**: Stores uploaded files securely.
- **CloudFront**: Provides fast and efficient content delivery.
- **Pre-Signed URL**: Enables secure file uploads directly to S3.

This system ensures that file uploads are handled securely and efficiently, with optimized delivery through CloudFront.
