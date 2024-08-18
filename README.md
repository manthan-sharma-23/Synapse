# Synapse

Welcome to **Synapse**—a modern, real-time messaging system designed to streamline communication and collaboration. Synapse allows users to chat, make calls, and manage group interactions seamlessly.

## Tech Stack

Synapse is built using the following technologies:

- **Client**:
  - **React** with **Vite**: A fast and efficient front-end framework.
  - **Tailwind CSS**: For beautiful, responsive design.
  - **Shadcn UI**: UI components for React.
- **Server**:
  - **Node.js** with **Express**: For the backend API.
  - **Socket.IO**: For real-time communication.
  - **Mediasoup**: SFU for audio and video conferencing.
  - **Drizzle ORM** with **Postgres**: For database management.
  - **Amazon S3**: For file uploads and storage.
  - **Redis**: For caching and real-time features.
- **Deployment**
  - **Server**: AWS EC2 using NGINX reverse proxy with ssl
  - **Client**: Vercel hosting
  - **Database**: Aiven 

## Excalidraw Architecture Diagram

Here’s a visual representation of the Synapse architecture:

[Excalidraw space](https://excalidraw.com/#json=MtMfNvbch1OV3zoISrgjX,JWSNTZyMzJ3zC8Vm-XouNA)

Here's a DBML schema representation:

[DB DIAGRAM](https://dbdiagram.io/d/66c1ea848b4bb5230e676557)

## Features

Synapse includes a variety of features:

- **Real-time Messaging**: Send and receive messages instantly.
- **Online/Offline Status**: Track user presence in real-time.
- **Typing Indicators**: See when other users are typing.
- **Read Receipts**: Know when your messages have been read.
- **File Uploads**: Upload and share images and videos.
- **Groups and Invites**: Manage group chats and send invitations.
- **User Profiles**: Customize and view user profiles.
- **Calling Functionality**: Audio and video calls using SFU architecture.
