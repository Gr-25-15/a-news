import { authClient } from "@/lib/auth-client";
import { UserWithRoles } from "@/types/usertype";

export async function getAllUsers() {
  const { data: users, error } = await authClient.admin.listUsers({
    query: {
      searchValue: "admin",
      limit: 100,
    },
  });

  console.log(users, error);

  return {users};
}
