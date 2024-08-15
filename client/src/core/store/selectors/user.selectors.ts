import { selector } from "recoil";
import { UserAtom } from "../atom/user.atom";

export const UserSelector = selector({
  key: "user/selector/main",
  get: ({ get }) => {
    const user = get(UserAtom);

    return user?.user;
  },
});

export const UserPreferenceSelector = selector({
  key: "user/preference/selector/main",
  get: ({ get }) => {
    const user = get(UserAtom);

    return user?.user_preferences;
  },
});
