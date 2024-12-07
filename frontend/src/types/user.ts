export interface User {
  id: number;
  username: string;
  email: string;
  status: number;
  created_at: string;
}

export interface UserListResponse extends Array<User> {}