import { signOut } from "@/auth.js"
 
export function SO() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({redirectTo: "/signin"});
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  )
}