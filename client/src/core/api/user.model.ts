import axios from "axios";
import { configurations } from "../lib/config/config";
import { AuthenticateUser, LoggedUser } from "../lib/types/auth.types";
import { GetUserQuery } from "../lib/types/query.types";

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

  get user() {
    return {
      get_user: this.get_user,
      login_user: this.login_user,
      register_user: this.register_user,
    };
  }
}

export default new UserModel();
