import { NextResponse } from "next/server";
import postsRepo from "@/repos/posts";

// DELETE /api/posts/:id – delete a post (body: { userId })
export async function DELETE(request, { params }) {
  const {  post_id } = await params;
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  try {
    await postsRepo.deletePost(Number(post_id), Number(userId));
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Not authorized to delete this post." }, { status: 403 });
    }
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
}
