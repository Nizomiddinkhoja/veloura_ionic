import { UserRole } from "./user-role";

export interface User {
  created_at: string
  id: number
  name: string,
  email: string,
  password: string,
  updated_at: string,
  role: UserRole,
}
