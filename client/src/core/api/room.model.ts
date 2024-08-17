import axios from "axios";
import { configurations } from "../lib/config/config";
import { IRoomDetails } from "../lib/types/schema";
import { RoomChats, RoomExpandedDetails } from "../lib/types/global.types";

class RoomModel {
  private base_url: string;
  private token: string;

  constructor() {
    this.base_url = configurations.server.http_url + "/api/room";
    this.token = "Bearer " + localStorage.getItem("token");
  }

  async get_room_details(input: { roomId?: string }) {
    if (!input.roomId) return;
    const res = (
      await axios.get(this.base_url + `/${input.roomId}`, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as IRoomDetails;

    return res;
  }

  async get_room_chats(input: { roomId?: string }) {
    if (!input.roomId) {
      return;
    }

    const res = (
      await axios.get(this.base_url + `/chats/${input.roomId}`, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as RoomChats[];

    return res;
  }

  async get_room_details_n_media(input: { roomId?: string }) {
    if (!input.roomId) {
      return;
    }

    const res = (
      await axios.get(this.base_url + `/media/${input.roomId}`, {
        headers: {
          Authorization: this.token,
        },
      })
    ).data as RoomExpandedDetails;

    return res;
  }
}

export default new RoomModel();
