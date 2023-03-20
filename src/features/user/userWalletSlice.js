import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";

const initialState = {
  cardsList: {},
  banksList: {},
  defaultCard: {},
  defaultBank: {},
};

const fetchCardsList = createAsyncThunk(
  "wallet/fetchCardsList",
  async (_, thunkAPI) => {
    try {
      const { data } = await apiRequest.cardsList();
      if (!data.success) throw data.message;
      console.log(data.data.cards);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const userWalletSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCardsList.fulfilled, (state, action) => {
      state.cardsList = action.payload.cards;
      const defaultcard = action.payload.cards?.find(
        (card) => card.mark_as_default === 1
      );
      state.defaultCard = defaultcard;
    });
  },
});

export { fetchCardsList };
export const {} = userWalletSlice.actions;
export default userWalletSlice.reducer;
