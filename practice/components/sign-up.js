import { connectDB } from "@/lib/db";
import {User} from "@/models/user";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  return (
    <form
      action={async (formData) => {
        "use server"
        let conn = await connectDB();
        const newUser = new User({
          name: formData.get("Name"),
          email: formData.get("email"),
          password: formData.get("password"),
        });
        await newUser.save();
        redirect("/signin");
      }}
    >
      <label>
        Name
        <input name="Name" type="text" />
      </label>
      <br></br>

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
      <button>Sign Up</button>
      <Link href="/signin">Have account Sign In here?</Link>
    </form>
  )
}