export interface User {
  sub: string;
  exp: string;
  auth: string;
}

export interface UserByRole {
  _id: string;
  username: string;
}
