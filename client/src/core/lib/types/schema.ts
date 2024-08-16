// User interface
export interface IUser {
  id: string;
  name?: string | null;
  email: string;
  username: string;
  password: string;
  image?: string | null;
  createdAt: Date;
  status: boolean;
  lastLoggedIn: Date;
}

// User Preferences interface
export interface IUserPreferences {
  id: string;
  theme: string;
  userId: string;
}

// Room interface
export interface IRoom {
  id: string;
  type: "peer" | "group";
  name?: string;
  createdAt: Date;
}

// UserRoom interface (relationship between users and rooms)
export interface IUserRoom {
  id: string;
  userId: string;
  roomId: string;
  joinedAt: Date;
}

// Chat interface
export interface IChat {
  id: string;
  type: "text" | "image" | "video";
  url?: string | null;
  createdAt: Date;
  roomId: string;
  userId: string;
}

export interface IRoomDetails {
  room: IRoom;
  users: IUser[];
}
