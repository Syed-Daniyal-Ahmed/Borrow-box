import { signIn } from "@/auth"
import Link from "next/link";
 
export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        try{await signIn("credentials", {email: formData.get("email"),password: formData.get("password"),redirectTo:"/dashboard"});}
        catch(err){
            if(err.message?.includes("NEXT_REDIRECT")){
                throw err;
            }
        }
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <br></br>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <br></br>
      <button>Sign In</button>
      <Link href="/signup">Dont have account Sign Up here?</Link>
    </form>
  )
}