// ===========================
// File 1: companyJobSlice.ts
// ===========================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobResponse } from "@/constants/Interfaces/Types/Jobs.interface";

// ------------------------
// Pagination Interface
// ------------------------
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ------------------------
// Slice State
// ------------------------
interface CompanyJobState {
  openJobs: JobResponse[] | null;
  closedJobs: JobResponse[] | null;
  openMeta: PaginationMeta | null;
  closedMeta: PaginationMeta | null;
  loading: boolean;
}

// ------------------------
// Initial State
// ------------------------
const initialState: CompanyJobState = {
  openJobs: null,
  closedJobs: null,
  openMeta: null,
  closedMeta: null,
  loading: false,
};

// ------------------------
// Slice
// ------------------------
const companyJobSlice = createSlice({
  name: "companyJobs",
  initialState,
  reducers: {
    // ------------------------
    // Loading
    // ------------------------
    setLoading(state, action: PayloadAction<boolean>): void {
      state.loading = action.payload;
    },

    // ------------------------
    // Set Job Lists (page 1)
    // ------------------------
    setCompanyOpenJobs(
      state,
      action: PayloadAction<{ jobs: JobResponse[]; meta: PaginationMeta }>
    ): void {
      state.openJobs = action.payload.jobs;
      state.openMeta = action.payload.meta;
    },

    setCompanyClosedJobs(
      state,
      action: PayloadAction<{ jobs: JobResponse[]; meta: PaginationMeta }>
    ): void {
      state.closedJobs = action.payload.jobs;
      state.closedMeta = action.payload.meta;
    },

    // ------------------------
    // Append Jobs (next pages)
    // ------------------------
    appendOpenJobs(
      state,
      action: PayloadAction<{ jobs: JobResponse[]; meta: PaginationMeta }>
    ): void {
      state.openJobs = state.openJobs
        ? [...state.openJobs, ...action.payload.jobs]
        : action.payload.jobs;

      state.openMeta = action.payload.meta;
    },

    appendClosedJobs(
      state,
      action: PayloadAction<{ jobs: JobResponse[]; meta: PaginationMeta }>
    ): void {
      state.closedJobs = state.closedJobs
        ? [...state.closedJobs, ...action.payload.jobs]
        : action.payload.jobs;

      state.closedMeta = action.payload.meta;
    },

    // ------------------------
    // Delete Job
    // ------------------------
    deleteJob(state, action: PayloadAction<string>): void {
      const jobId = action.payload;

      if (state.openJobs) {
        state.openJobs = state.openJobs.filter((job) => job._id !== jobId);
      }
      if (state.closedJobs) {
        state.closedJobs = state.closedJobs.filter((job) => job._id !== jobId);
      }
    },

    // ------------------------
    // Move Job: Open → Closed
    // ------------------------
    moveJobToClosed(state, action: PayloadAction<string>): void {
      const jobId = action.payload;
      if (!state.openJobs) return;

      const job = state.openJobs.find((j) => j._id === jobId);
      if (!job) return;

      state.openJobs = state.openJobs.filter((j) => j._id !== jobId);

      state.closedJobs = state.closedJobs
        ? [...state.closedJobs, { ...job, status: "closed" }]
        : [{ ...job, status: "closed" }];
    },

    // ------------------------
    // Move Job: Closed → Open
    // ------------------------
    moveJobToOpen(state, action: PayloadAction<string>): void {
      const jobId = action.payload;
      if (!state.closedJobs) return;

      const job = state.closedJobs.find((j) => j._id === jobId);
      if (!job) return;

      state.closedJobs = state.closedJobs.filter((j) => j._id !== jobId);

      state.openJobs = state.openJobs
        ? [...state.openJobs, { ...job, status: "open" }]
        : [{ ...job, status: "open" }];
    },

    // ------------------------
    // Update Job Details
    // ------------------------
    updateJobDetails(state, action: PayloadAction<JobResponse>): void {
      const updatedJob = action.payload;

      if (state.openJobs) {
        state.openJobs = state.openJobs.map((job) =>
          job._id === updatedJob._id ? updatedJob : job
        );
      }

      if (state.closedJobs) {
        state.closedJobs = state.closedJobs.map((job) =>
          job._id === updatedJob._id ? updatedJob : job
        );
      }
    },
  },
});

// ------------------------
// Export Actions & Reducer
// ------------------------
export const {
  setCompanyOpenJobs,
  setCompanyClosedJobs,
  appendOpenJobs,
  appendClosedJobs,
  deleteJob,
  moveJobToClosed,
  moveJobToOpen,
  updateJobDetails,
  setLoading,
} = companyJobSlice.actions;

export default companyJobSlice.reducer;
