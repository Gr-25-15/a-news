import { UserWithRoles } from "@/types/usertype";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
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
{/* {users.map((users) => (
<TableRow key={users.id}>

        </TableRow>
))} */}
        
      </TableBody>
    </Table>
  );
}
