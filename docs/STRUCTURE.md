# Directory Overview

## Client
- **React Vite Client** with Shadcn, Tailwind and Recoil

  - **[`src`](../client/src/)**: Main source folder
    - **[`app.tsx`](../client/src/app.tsx)**: Entry point for routing, rendering, and configuration
    - **[`views`](../client/src/views/)**: Contains page components
    - **[`core`](../client/src/core/)**: Core functionality
      - **[`store`](../client/src/core/store/)**: State management using Recoil
      - **[`lib`](../client/src/core/lib/)**: Helpers, types, and validators
      - **[`api`](../client/src/core/api/)**: Server communication and API calls
      - **[`hooks`](../client/src/core/hooks/)**: Custom React hooks
    - **[`components`](../client/src/components/)**: Reusable UI components
      - **[`ui`](../client/src/components/ui/)**: Shadcn UI components
      - **[`layouts`](../client/src/components/layouts/)**: Layouts for pages
      - **[`utilities`](../client/src/components/utilities/)**: Functional components used in the app
      - **[`pages`](../client/src/components/pages/)**: Components for no window page, error page, loading page

## Server
- **Express** with Socket.IO, Mediasoup, Drizzle ORM (Postgres)

  - **`.env.example`**: Configuration example file

  - **[`src/`](../server/src/)**: Contains the actual code
    - **[`db/`](../server/src/db/)**: Database-related files
      - **[`schema.ts`](../server/src/db/schema.ts)**: Contains the complete database schema
      - **[`database.service.ts`](../server/src/db/database.service.ts)**: Contains queries and mutations performed in the database
    - **[`core/`](../server/src/core/)**: Core functionality
      - **[`config/`](../server/src/core/config/)**: Configuration files
      - **[`lib/`](../server/src/core/lib/)**: Helpers, error handling, types, and validators
      - **[`middlewares/`](../server/src/core/middlewares/)**: Middleware, mainly for authentication
      - **[`services/`](../server/src/core/services/)**: Business logic and services
        - **[`conferencing-services/`](../server/src/core/services/conferencing-services/)**: Services related to calling and meetings
        - **[`s3.service.ts`](../server/src/core/services/s3.service.ts)**: Service for interacting with Amazon S3
        - **[`socket.service.ts`](../server/src/core/services/socket.service.ts)**: Service for managing Socket.IO
        - **[`jwt.service.ts`](../server/src/core/services/jwt.service.ts)**: Service for handling JSON Web Tokens (JWT)
        - **[`bcrypt.service.ts`](../server/src/core/services/bcrypt.service.ts)**: Service for password hashing with bcrypt
        - **[`redis.service.ts`](../server/src/core/services/redis.service.ts)**: Service for interacting with Redis
    - **[`api/`](../server/src/api/)**: API-related files
      - **[`user-model/`](../server/src/api/user-model/)**: Models, routers, and controllers for the user table
      - **[`room-model/`](../server/src/api/room-model/)**: Models, routers, and controllers for the room table
      - **[`invite-model/`](../server/src/api/invite-model/)**: Models, routers, and controllers for the invite table
