import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user || !user.status) {
      return Response.json({ error: "User or number not found" }, { status: 404 });
    }

    return Response.json({
      link: user.status,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}