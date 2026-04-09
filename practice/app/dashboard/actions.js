"use server";

import { connectDB } from "@/lib/db";
import { posts } from "@/models/post";

export const updateStatus = async (id, status) => {
  await connectDB();

  await posts.findByIdAndUpdate(id, { status });
};