import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "helpers/apiRequests";

const initialState = {
  loadingPayment: false,
  transactionDetails: {},
  setupDeviceAuthDetails: {
    transactionId: "",
    referenceId: "",
    accessToken: "",
    deviceDataCollectionUrl: "",
  },
  enrollmentAuthDetails: {
    status: "",
    veResEnrolled: "",
    paResStatus: "",
    transactionId: "",
    referenceId: "",
    accessToken: "",
    stepUpURL: "",
  },
  paymentStatus: "", // IN_PROGRESS | IN_WAITING | COMPLETED | FAILED
  message: "",
};

/** fetchAddFundWithCard
 * @params card_number, transactionAmount, expiry_date, save_card
 * @returns success, message, data: { transactionId, referenceId, accessToken, deviceDataCollectionUrl }
 */
export const fetchAddFundWithCard = createAsyncThunk(
  "payment/addFundWithCard",
  async (creds, thunkAPI) => {
    try {
      const { data } = await apiRequest.addFundWithCard(creds);
      if (!data.success) throw data;
      return { ...data, creds };
    } catch (error) {
      return thunkAPI.rejectWithValue({ ...error, creds });
    }
  }
);

/** fetchCheckEnrollment
 * @params status, referenceId
 * @returns success, message, data: null
 * @returns success, message, data: { veResEnrolled, paResStatus, transactionId, referenceId, accessToken, stepUpURL }
 */
export const fetchCheckEnrollment = createAsyncThunk(
  "payment/checkEnrollment",
  async (creds, thunkAPI) => {
    try {
      const { data } = await apiRequest.checkEnrollment(creds);
      if (!data.success) throw data;
      return { ...data, creds };
    } catch (error) {
      return thunkAPI.rejectWithValue({ ...error, creds });
    }
  }
);

const payAddFundSlice = createSlice({
  name: "payAddFund",
  initialState,
  reducers: {
    fundPaymentCompleted(state, action) {
      state.loadingPayment = false;
      state.paymentStatus = "COMPLETED";
      state.message = action.payload?.message || "";
    },
    fundPaymentFailed(state, action) {
      state.loadingPayment = false;
      state.paymentStatus = "FAILED";
      state.message = action.payload?.message || "";
    },
    fundPaymentReset(state, action) {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAddFundWithCard.pending, (state, action) => {
      return Object.assign({ ...initialState }, { loadingPayment: true });
    });
    builder.addCase(fetchAddFundWithCard.fulfilled, (state, action) => {
      state.setupDeviceAuthDetails = action.payload.data;
      state.transactionDetails = action.payload.creds;
      state.message = action.payload?.message || "";
      state.paymentStatus = "IN_PROGRESS";
    });
    builder.addCase(fetchAddFundWithCard.rejected, (state, action) => {
      state.loadingPayment = false;
      state.transactionDetails = action.payload.creds;
      state.message = action.payload?.message || "";
      state.paymentStatus = "FAILED";
    });
    builder.addCase(fetchCheckEnrollment.pending, (state, action) => {
      state.loadingPayment = true;
      state.paymentStatus = "IN_PROGRESS";
    });
    builder.addCase(fetchCheckEnrollment.fulfilled, (state, action) => {
      const { status = "" } = action.payload?.data || {};
      const { message = "" } = action.payload || "";
      state.message = message;
      switch (status) {
        case "AUTHORIZED":
          state.loadingPayment = false;
          state.paymentStatus = "COMPLETED";
          return;
        case "PENDING_AUTHENTICATION":
          state.loadingPayment = true;
          state.enrollmentAuthDetails = action.payload?.data || {};
          state.paymentStatus = "IN_WAITING";
          return;
        case "AUTHENTICATION_FAILED":
          state.loadingPayment = false;
          state.paymentStatus = "FAILED";
          return;
      }
    });
    builder.addCase(fetchCheckEnrollment.rejected, (state, action) => {
      state.loadingPayment = false;
      state.transactionDetails = action.payload.creds;
      state.message = action.payload?.message || "";
      state.paymentStatus = "FAILED";
    });
  },
});

export const { fundPaymentCompleted, fundPaymentFailed, fundPaymentReset } =
  payAddFundSlice.actions;
export default payAddFundSlice.reducer;
