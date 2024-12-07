export interface User {
  id: number;
  username: string;
  email: string;
  status: number;
  created_at: string;
}

export interface getUsersResponse {
  records: User[];
  total: number;
  current: number;
  pageSize: number;
}