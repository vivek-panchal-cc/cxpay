import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "helpers/apiRequests";

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
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const fetchBanksList = createAsyncThunk(
  "wallet/fetchBanksList",
  async (_, thunkAPI) => {
    try {
      const { data } = await apiRequest.getBankList();
      if (!data.success) throw data.message;
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
    builder
      .addCase(fetchCardsList.fulfilled, (state, action) => {
        state.cardsList = action.payload.cards;
        const defaultcard = action.payload.cards?.find(
          (card) => card.mark_as_default === 1
        );
        state.defaultCard = defaultcard;
      })
      .addCase(fetchBanksList.fulfilled, (state, action) => {
        state.banksList = action.payload.banks;
        const defaultBank = action.payload.banks?.find(
          (bank) => bank.mark_as_default === 1
        );
        state.defaultBank = defaultBank;
      });
  },
});

export { fetchCardsList, fetchBanksList };
export default userWalletSlice.reducer;
