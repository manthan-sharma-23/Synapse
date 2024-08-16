import axios from "axios";
import { configurations } from "../lib/config/config";
import { IUserInvites } from "../lib/types/schema";
import { CreateGroupMutation } from "../lib/types/query.types";

class InvitesModel {
  private base_url: string = configurations.server.http_url + "/api/invite";
  private token: string = "Bearer " + localStorage.getItem("token");

  constructor() {
    this.base_url = configurations.server.http_url + "/api/invite";
    this.token = "Bearer " + localStorage.getItem("token");
  }

  async create_group(input: { name: string }) {
    console.log(input, this.base_url);

    if (!input.name || input.name.length <= 3) return;
    const res = (
      await axios.post(this.base_url + `/create`, input, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as CreateGroupMutation;

    return res;
  }

  async list_user_invites() {
    const res = (
      await axios.get(this.base_url, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as IUserInvites[];

    return res;
  }
}

export default new InvitesModel();
