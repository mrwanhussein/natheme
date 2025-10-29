export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  location?: string;
  created_at?: Date;
}
