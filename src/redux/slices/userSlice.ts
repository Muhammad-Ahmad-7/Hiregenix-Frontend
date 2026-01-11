import {
  CandidateProfileResponse,
  CompanyResponse,
} from "@/constants/Interfaces/Types/Profile.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Add discriminator to your types
type CandidateProfile = CandidateProfileResponse & { userType: "candidate" };
type CompanyProfile = CompanyResponse & { userType: "company" };
type UserProfile = CandidateProfile | CompanyProfile;

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
}

const initialState: UserState = {
  profile: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
    clearUserProfile(state) {
      state.profile = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setProfile, clearUserProfile, setLoading } = userSlice.actions;
export default userSlice.reducer;
