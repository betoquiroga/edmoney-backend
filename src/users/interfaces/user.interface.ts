export interface IUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserResponse {
  user: IUser;
  message?: string;
}

export interface IUsersResponse {
  users: IUser[];
  message?: string;
}
