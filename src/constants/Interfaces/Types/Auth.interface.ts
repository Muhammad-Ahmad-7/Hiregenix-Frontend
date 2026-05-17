export type Role = "candidate" | "company";

export interface LoginResponse extends AccessToken {
  user: {
    id: string;
    email: string;
    role: Role;
    isProfileCompleted: boolean;
  };
}

export interface LoginWithGoogleResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: Role;
    isProfileCompleted: boolean;
  }
  new: boolean; // Indicates if the user is new or existing
}
export interface AccessToken {
  accessToken: string;
  role: Role;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface SignUpBody extends LoginBody {
  role: Role;
}
