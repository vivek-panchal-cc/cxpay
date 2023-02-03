import { USERPROFILE } from "store/actions/actionTypes";

const initialState = {
  userProfile: "",
};

const userProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERPROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    default:
      return state;
  }
};

export default userProfileReducer;
