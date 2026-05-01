import { NextResponse } from "next/server";
import postsRepo from "@/repos/posts";

// GET /api/posts?userId=X – get feed for a user
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = Number(searchParams.get("userId"));

  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  const posts = await postsRepo.getFeed(userId);
  return NextResponse.json(posts);
}

// POST /api/posts – create a new post
export async function POST(request) {
  const { userId, content } = await request.json();

  if (!userId || !content?.trim()) {
    return NextResponse.json({ error: "userId and content are required." }, { status: 400 });
  }

  const post = await postsRepo.createPost(Number(userId), content.trim());
  return NextResponse.json(post, { status: 201 });
}
