import { UserWithRoles } from "@/types/usertype";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { getAllUsers } from "@/app/actions/manageUsers";


type UsersTableProps = {
    users: UserWithRoles[];
}


export async function UserManagementTable() {
const users = await getAllUsers();

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
        {users?.users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>Edit</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
