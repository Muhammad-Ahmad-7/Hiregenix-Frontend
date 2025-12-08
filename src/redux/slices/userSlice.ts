import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface CompanyProfile {
  _id: string;

  userId: {
    _id: string;
    email: string;
    role: "company";
  };

  companyName: string;
  logoUrl: string;

  website?: string;
  city?: string;
  country?: string;

  foundedYear?: number;
  description?: string;

  contactEmail?: string;
  linkedInUrl?: string;

  techStack: string[];

  isVerified: boolean;
  hiringStatus: "actively_hiring" | "not_hiring" | "paused";

  ntnNumber?: string;

  isDeleted: boolean | string;
  isProfileCompleted: boolean;

  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  userId: {
    _id: string;
    email: string;
    role: "candidate" | "comapny";
  };
  fullName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  city: string;
  contactNumber: string;
  profilePictureUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  skills: string[];
  bio: string;
  tagline: string;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
}

const initialState: UserState | CompanyProfile = {
  profile: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = {
        ...state.profile, // keep previous values
        ...action.payload, // update only changed fields
      };
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
