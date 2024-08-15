export interface UserInput {
  email: string;
  password: string;
  name?: string;
}

export type token = string;
export interface AuthenticateUser {
  name?: string;
  email: string;
  password: string;
}

export interface LoggedUser {
  token: token;
  message: string;
}

export type filterDashboard = "topics" | "flashcards";
