import { NextResponse } from "next/server";
import usersRepo from "@/repos/users";

// POST /api/follow – toggle follow (body: { followerId, followingId })
export async function POST(request) {
  const { followerId, followingId } = await request.json();

  if (!followerId || !followingId) {
    return NextResponse.json({ error: "followerId and followingId are required." }, { status: 400 });
  }

  if (followerId === followingId) {
    return NextResponse.json({ error: "Cannot follow yourself." }, { status: 400 });
  }

  const result = await usersRepo.toggleFollow(Number(followerId), Number(followingId));
  return NextResponse.json(result);
}
