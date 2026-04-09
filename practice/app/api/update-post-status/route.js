import { connectDB } from "@/lib/db";
import { posts } from "@/models/post";

export async function POST(req) {
  const { id, status } = await req.json();

  await connectDB();

  await posts.findByIdAndUpdate(id, { status });

  return Response.json({ success: true });
}