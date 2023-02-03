import { USERPROFILE } from "./actionTypes"

export const userProfileAction = (value) => (dispatch) => {
    dispatch({
      type: USERPROFILE,
      payload: value
    })
  }
  