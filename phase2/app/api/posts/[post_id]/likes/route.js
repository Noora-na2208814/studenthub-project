import { NextResponse } from "next/server";
import postsRepo from "@/repos/posts";

// POST /api/posts/:id/likes – toggle like (body: { userId })
export async function POST(request, { params }) {
  const { post_id } = await params;
  const postId = Number(post_id);
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  const result = await postsRepo.toggleLike(postId, Number(userId));
  return NextResponse.json(result);
}
