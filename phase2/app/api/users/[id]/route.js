import { NextResponse } from "next/server";
import usersRepo from "@/repos/users";

// PUT /api/users/:id – update profile
export async function PUT(request, { params }) {
  const { id } = await params;
  const { username, bio, profilePicture } = await request.json();

  if (!username) {
    return NextResponse.json({ error: "Username is required." }, { status: 400 });
  }

  try {
    const user = await usersRepo.updateUser(Number(id), { username, bio, profilePicture });
    return NextResponse.json(user);
  } catch (error ){
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
}
