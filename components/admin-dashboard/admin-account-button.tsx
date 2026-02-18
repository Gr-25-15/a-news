"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";

//TODO:toremove
export function SignInButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await authClient.signIn.email({
          email: "admin@testtest.se",
          password: "Test1234",
        });
        router.refresh();
      }}
    >
      Sign in with Admin session
    </Button>
  );
}

export function SignUpButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await authClient.signUp.email({
          name: "admin",
          email: "admin@testtest.se",
          password: "Test1234",
        });
        router.refresh();
      }}
    >
      Sign Up the Admin session
    </Button>
  );
}

// export function CreateAdminButton() {
//   const router = useRouter();
//   return (
//     <Button
//       onClick={async () => {
//         const { data: newUser, error } = await authClient.admin.createUser({
//           email: "admin@testtest.se", // required
//           password: "Test1234", // required
//           name: "James Smith",
//           role: "admin",
//         });
//         console.log(newUser)
//         return newUser;
//         router.refresh();
//       }}
//     >
//       Create Admin
//     </Button>
//   );
// }
