## Authentication and Token Management

### Description
The authentication and token management system ensures secure access to the application by verifying user identities and managing session tokens. This feature includes user registration, login, and token-based authentication for accessing protected resources.

### Implementation

1. **User Registration and Login**
   - **Registration**: New users can create an account by providing their details. This process involves hashing passwords and storing user credentials securely in the database.
     - **File**: [`user-model/`](../server/src/api/user-model/)
       - **[`user-routes/`](../server/src/api/user-model/user.routes.ts)**: Defines the routes for user data.
       - **[`user-controller/`](../server/src/api/user-model/user.controller.ts)**: Handles the registration logic, including password hashing using `bcrypt` and saving user information.
   - **Login**: Existing users authenticate by providing their credentials. The system validates these credentials and generates a JSON Web Token (JWT) upon successful authentication.
   
2. **Token Generation and Validation**
   - **JWT**: JSON Web Tokens are used to authenticate users and ensure secure communication between the client and server.
     - **File**: 
       - **[`jwt-service/`](../server/src/core/services/jwt.service.ts)**: Contains methods for generating and validating JWT tokens. Tokens include user information and expiration details.
   - **Token Storage**: Tokens are stored on the client-side (e.g., in localStorage or sessionStorage) and are included in request headers to access protected routes.

3. **Protected Routes**
   - **Middleware**: Middleware functions verify JWT tokens for protected routes, ensuring that only authenticated users can access specific resources.
     - **File**: `core/middlewares/`
       - **[`authentication-middleware/`](../server/src/core/middlewares/authentication.middleware.ts)**: Middleware that checks for valid JWT tokens
