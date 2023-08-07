import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "helpers/apiRequests";

const initialState = {
  loadingPayment: "",
  transactionDetails: {},
  setupDeviceAuthDetails: {
    transactionId: "",
    referenceId: "",
    accessToken: "",
    deviceDataCollectionUrl: "",
  },
  enrollmentAuthDetails: {
    veResEnrolled: "",
    paResStatus: "",
    transactionId: "",
    referenceId: "",
    accessToken: "",
    stepUpURL: "",
  },
  paymentStatus: "", // IN_PROGRESS | COMPLETED | FAILED
  error: false,
  errorMessage: "",
};

/** fetchSetupPayerAuth
 * @param card_number, transactionAmount, expiry_date, save_card
 * @returns success, message, data: { transactionId, referenceId, accessToken, deviceDataCollectionUrl }
 */
export const fetchSetupPayerAuth = createAsyncThunk(
  "payment/setupPayerAuth",
  async (creds, thunkAPI) => {
    try {
      const { data } = await apiRequest.setupPayerAuth(creds);
      if (!data.success) throw data.message;
      return { data: data?.data, creds };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

/** fetchCheckEnrollment
 * @param status, referenceId
 * @returns success, message, data: null
 * @returns success, message, data: { veResEnrolled, paResStatus, transactionId, referenceId, accessToken, stepUpURL }
 */
export const fetchCheckEnrollment = createAsyncThunk(
  "payment/checkEnrollment",
  async (creds, thunkAPI) => {
    try {
      const { data } = await apiRequest.checkEnrollment(creds);
      if (!data.success) throw data.message;
      return { data: data?.data, creds };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const paymentAddFundSlice = createSlice({
  initialState: initialState,
  name: "paymentAddFundSlice",
  extraReducers: (builder) => {
    builder.addCase(fetchSetupPayerAuth.pending, (state, action) => {
      return Object.assign({ ...initialState }, { loadingPayment: true });
    });
    builder.addCase(fetchSetupPayerAuth.fulfilled, (state, action) => {
      state.setupDeviceAuthDetails = action.payload.data;
      state.transactionDetails = action.payload.creds;
      state.paymentStatus = "IN_PROGRESS";
    });
    builder.addCase(fetchSetupPayerAuth.rejected, (state, action) => {
      state.loadingPayment = false;
      state.transactionDetails = action.payload.creds;
      state.paymentStatus = "FAILED";
      state.error = true;
      state.errorMessage = action.payload?.message || "";
    });
    builder.addCase(fetchCheckEnrollment.pending, (state, action) => {
      state.loadingPayment = true;
    });
    builder.addCase(fetchCheckEnrollment.fulfilled, (state, action) => {
      state.loadingPayment = true;
      state.enrollmentAuthDetails = action.payload.data;
      state.transactionDetails = action.payload.creds;
      state.paymentStatus = "IN_PROGRESS";
    });
    builder.addCase(fetchCheckEnrollment.rejected, (state, action) => {
      state.loadingPayment = false;
      state.transactionDetails = action.payload.creds;
      state.paymentStatus = "FAILED";
      state.error = true;
      state.errorMessage = action.payload?.message || "";
    });
  },
});
