import { createAccessControl } from "better-auth/plugins";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/organization/access";

export const statement = {
  ...defaultStatements,
  article: ["create", "read", "edit", "delete"],
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
  ...adminAc.statements,
});
