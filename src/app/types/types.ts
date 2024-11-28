export interface SensitiveData {
  id: number;
  title: string; // This has a limit of 255 characters
  description: string; // This is "hash" in the database
  created_at: string;
  updated_at: string;
}

export interface User {
  username: string;
  password: string;
}
