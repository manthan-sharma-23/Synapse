export const INTERNAL_SERVER_ERROR = {
  code: 500,
  action: { message: "Internal server error. An unexpected issue occurred." },
};

export const USER_ALREADY_EXISTS = {
  code: 403,
  action: { message: "User already exists." },
};
export const USER_DOESNT_EXISTS = {
  code: 403,
  action: { message: "User doesn't exists." },
};

export const USER_CREATED_SUCCESSFULLY = {
  code: 201,
  action: { message: "User created successfully." },
};

export const INVALID_INPUTS = {
  code: 400,
  action: { message: "Invalid input provided." },
};

export const DONT_EXISTS = {
  code: 404,
  action: { message: "Data not found." },
};

export const USER_LOGGED_IN_SUCCESSFULLY = {
  code: 200,
  action: { message: "Login successful." },
};

export const RESOURCE_FOUND_SUCCESSFULLY = {
  code: 200,
  action: { message: "Resource found successfully." },
};

export const UNAUTHORIZED_ACCESS = {
  code: 401,
  action: {
    message:
      "Unauthorized access. You do not have permission to access this resource.",
  },
};

export const FORBIDDEN_RESOURCE = {
  code: 403,
  action: { message: "Access to this resource is forbidden." },
};

export const RESOURCE_NOT_FOUND = {
  code: 404,
  action: { message: "Resource not found." },
};

export const RESOURCE_UPDATED_SUCCESSFULLY = {
  code: 200,
  action: { message: "Resource updated successfully." },
};

export const RESOURCE_DELETED_SUCCESSFULLY = {
  code: 200,
  action: { message: "Resource deleted successfully." },
};

export const RESOURCE_NOT_MODIFIED = {
  code: 304,
  action: { message: "Resource not modified." },
};

export const REQUEST_TIMEOUT = {
  code: 408,
  action: { message: "Request timeout. The request took too long to process." },
};

export const CONFLICT_DETECTED = {
  code: 409,
  action: { message: "Conflict detected while processing the request." },
};

export const RESOURCE_CREATED_SUCCESSFULLY = {
  code: 201,
  action: { message: "Resource created successfully." },
};

export const VALIDATION_ERROR = {
  code: 422,
  action: { message: "Validation error. The request failed validation." },
};

export const SERVER_UNAVAILABLE = {
  code: 503,
  action: {
    message: "Server unavailable. The server is currently unavailable.",
  },
};

export const INVALID_TOKEN = {
  code: 401,
  action: { message: "Invalid token. The provided token is invalid." },
};

export const TOKEN_EXPIRED = {
  code: 401,
  action: { message: "Token expired. The provided token has expired." },
};

export const MISSING_PARAMETERS = {
  code: 400,
  action: { message: "Bad request. Required parameters are missing." },
};

export const DATABASE_ERROR = {
  code: 500,
  action: {
    message: "Database error. An error occurred while accessing the database.",
  },
};

export const SERVICE_UNAVAILABLE = {
  code: 503,
  action: {
    message:
      "Service unavailable. The requested service is temporarily unavailable.",
  },
};

export const NOT_IMPLEMENTED = {
  code: 501,
  action: {
    message: "Not implemented. The requested functionality is not implemented.",
  },
};

export const INVALID_CREDENTIALS = {
  code: 401,
  action: {
    message: "Invalid credentials. The provided credentials are invalid.",
  },
};

export const ACCESS_FORBIDDEN = {
  code: 403,
  action: {
    message:
      "Access forbidden. You do not have permission to access this resource.",
  },
};

export const SERVER_ERROR = {
  code: 500,
  action: { message: "Server error. An internal server error occurred." },
};

export const TOO_MANY_REQUESTS = {
  code: 429,
  action: { message: "Too many requests. Rate limit exceeded." },
};

export const RESOURCE_CONFLICT = {
  code: 409,
  action: {
    message:
      "Conflict. There was a conflict with the current state of the resource.",
  },
};

export const MESSAGE_SENT_SUCCESSFULLY = {
  code: 200,
  action: { message: "Message sent successfully." },
};

export const NON_UNIQUE_RESOURCE = {
  code: 409,
  action: { message: "Conflict. The resource already exists in the system." },
};
