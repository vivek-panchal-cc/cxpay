import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "helpers/apiRequests";

const initialState = {
  sendContacts: [],
  requestContacts: [],
  groups: [],
  isEditable: true,
};
