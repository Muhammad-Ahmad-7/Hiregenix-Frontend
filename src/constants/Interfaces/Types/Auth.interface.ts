export type Role = "candidate" | "company";

export interface LoginResponse extends AccessToken {
  user: {
    id: string;
    email: string;
    role: Role;
    isProfileCompleted: boolean;
  };
}
export interface AccessToken {
  accessToken: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface SignUpBody extends LoginBody {
  role: Role;
}
