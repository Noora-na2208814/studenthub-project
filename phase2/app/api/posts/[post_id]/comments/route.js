import { NextResponse } from "next/server";
import postsRepo from "@/repos/posts";

// POST /api/posts/:id/comments – add a comment (body: { userId, text })
export async function POST(request, { params }) {
  const { post_id } = await params;
  const { userId, text } = await request.json();

  if (!userId || !text?.trim()) {
    return NextResponse.json(
      { error: "userId and text are required." },
      { status: 400 },
    );
  }

  const comment = await postsRepo.addComment(
    Number(post_id),
    Number(userId),
    text.trim(),
  );
  return NextResponse.json(comment, { status: 201 });
}
