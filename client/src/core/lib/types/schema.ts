// User Interface
export interface IUser {
  id: string;
  name?: string;
  email: string;
  username: string;
  password: string;
  image?: string;
  createdAt: Date;
  status: boolean;
  lastLoggedIn: Date;
}

// User Preferences Interface
export interface IUserPreferences {
  id: string;
  theme: string;
  userId: string;
}

// Room Interface
export interface IRoom {
  id: string;
  type: "peer" | "group";
  name?: string;
  createdAt: Date;
  createdBy?: string;
}

// UserRoom Interface
export interface IUserRoom {
  id: string;
  userId: string;
  roomId: string;
  joinedAt: Date;
}

// Chat Interface
export interface IChat {
  id: string;
  text?: string;
  type: "text" | "image" | "video";
  url?: string;
  createdAt: Date;
  roomId: string;
  userId: string;
}

// GroupInvite Interface
export interface IGroupInvite {
  id: string;
  roomId: string;
  userId: string;
  createdBy: string;
  createdAt: Date;
  status: "accepted" | "rejected" | "pending";
}

export interface IRoomDetails {
  room: IRoom;
  users: IUser[];
}

export interface IUserInvites {
  rooms: IRoom;
  group_invites: IGroupInvite;
}
