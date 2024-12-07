export interface User {
  id: number;
  username: string;
  email: string;
  status: number;
  created_at: string;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}