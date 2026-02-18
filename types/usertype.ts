export type UserWithRoles = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: "admin" | "user" | "editor";
};
