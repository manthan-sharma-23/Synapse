import axios from "axios";
import { configurations } from "../lib/config/config";
import { AuthenticateUser, LoggedUser } from "../lib/types/auth.types";
import { GetUserQuery } from "../lib/types/query.types";
import { UserRoomList } from "../lib/types/global.types";
import { IUser } from "../lib/types/schema";

class UserModel {
  private base_url: string;
  private token: string;

  constructor() {
    this.base_url = configurations.server.http_url + "/api/user";
    this.token = "Bearer " + localStorage.getItem("token");
  }

  private get_user = async () => {
    const data = (
      await axios.get(this.base_url, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as GetUserQuery;
    return data;
  };

  private login_user = async (
    user: AuthenticateUser
  ): Promise<LoggedUser & { isLoggedIn: boolean }> => {
    const data = (await axios.post(this.base_url + "/login", user))
      .data as LoggedUser;

    window.localStorage.setItem("token", data.token);

    if (data.token) {
      this.token = "Bearer " + data.token;
      return { ...data, isLoggedIn: true };
    }
    return { ...data, isLoggedIn: false };
  };

  private register_user = async (
    user: AuthenticateUser
  ): Promise<LoggedUser & { isLoggedIn: boolean }> => {
    const data = (await axios.post(this.base_url + "/register", user))
      .data as LoggedUser;

    window.localStorage.setItem("token", data.token);

    if (data.token) {
      this.token = "Bearer " + data.token;
      return { ...data, isLoggedIn: true };
    }
    return { ...data, isLoggedIn: false };
  };

  get_user_rooms = async () => {
    const data = (
      await axios.get(this.base_url + "/get-user-rooms", {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as UserRoomList[];

    return data;
  };

  list_all_users = async ({ roomId }: { roomId: string }) => {
    const data = (
      await axios.get(this.base_url + `/all/${roomId}`, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as IUser[];

    return data;
  };

  presign_user_picture = async (input: { fileName: string; file: File }) => {
    const data = (
      await axios.put(this.base_url + `/update-profile-picture`, input, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as {
      key: string;
      pre_sign_url: string;
      url: string;
      contentType: string;
    };

    console.log(data);

    if (!data.pre_sign_url) {
      return;
    }

    await axios.put(data.pre_sign_url, input.file, {
      headers: { "Content-Type": data.contentType },
    });

    return { url: data.url };
  };

  async update_user(input: { name?: string; url?: string; username: string }) {
    const data = (
      await axios.put(this.base_url + `/update-user`, input, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as IUser;

    return data;
  }

  async check_username(input: { username: string }) {
    const data = (
      await axios.get(this.base_url + `/username/${input.username}`, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as boolean;
    return data;
  }

  get user() {
    return {
      get_user: this.get_user,
      login_user: this.login_user,
      register_user: this.register_user,
    };
  }
}

export default new UserModel();
