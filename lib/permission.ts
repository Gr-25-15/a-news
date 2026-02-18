import { createAccessControl } from "better-auth/plugins";

export const statement = {
  article: ["create", "read", "edit", "delete"],
  user: ["create", "read", "set-role", "edit", "delete", "list"],
  session: ["read", "delete", "list"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  article: ["read"],
});

export const editor = ac.newRole({
  article: ["create", "read", "edit"],
});

export const admin = ac.newRole({
  article: ["create", "read", "edit", "delete"],
  user: ["create", "read", "set-role", "edit", "delete", "list"],
  session: ["read", "delete", "list"],
});
