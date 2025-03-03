import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface userStateI {
  id: number;
  email: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
}

const initialState: Partial<userStateI> = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addLoggedInUser: (state, action: { payload: userStateI }) => {
      return { ...state, ...action.payload };
    },
    removeLoggedInUser: () => {
      return {};
    },
    updateLoggedInUser: (state, action: { payload: Partial<userStateI> }) => {
      return { ...state, ...action.payload };
    },
  },
});


export const {addLoggedInUser, removeLoggedInUser, updateLoggedInUser} = userSlice.actions;
export const useSelector = (state: RootState) => state.user;

export default userSlice.reducer;