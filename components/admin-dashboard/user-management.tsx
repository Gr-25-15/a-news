"use client";

import { UserWithRoles } from "@/types/usertype";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { setUserRole } from "@/app/actions/manageUsers";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type UsersTableProps = {
  userList: UserWithRoles[];
};

export function UserManagementTable({ userList }: UsersTableProps) {
  const router = useRouter();

  async function handleRoleChange(
    userId: string,
    role: "admin" | "editor" | "user",
  ) {
    await setUserRole(userId, role);
    router.refresh();
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>E-Mail</TableHead>
          <TableHead>Registered</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userList?.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Button onClick={() => handleRoleChange(user.id, "user")}>
                User
              </Button>
              <Button onClick={() => handleRoleChange(user.id, "editor")}>
                Editor
              </Button>
              <Button onClick={() => handleRoleChange(user.id, "admin")}>
                Admin
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
