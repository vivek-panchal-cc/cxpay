import { USERPROFILE } from "./actionTypes";

export const userProfileAction = (value) => {
  return {
    type: USERPROFILE,
    payload: value,
  };
};
