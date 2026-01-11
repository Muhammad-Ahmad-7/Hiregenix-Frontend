// for enums

export enum UserRole {
  ADMIN = "admin",
  OFFICIAL = "official",
}

//useage
// if (user.role === UserRole.ADMIN) {
//   // do something
// }
export type Gender = "male" | "female" | "other";

export type ExperienceLevel = "entry" | "mid" | "senior";

export type HiringStatus = "actively_hiring" | "not_hiring" | "paused";

export type WorkMode = "full-time" | "part-time" | "remote";

export type JobStatus = "open" | "closed";

export type InterviewType = "live" | "recorded";

export type InterviewStatus = "scheduled" | "completed" | "cancelled";
