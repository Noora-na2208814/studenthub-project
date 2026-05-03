import { NextResponse } from "next/server";
import usersRepo from "@/repos/users";

// GET /api/users – return all users with followers/following arrays
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('searchTerm');
  const users = await usersRepo.getAll(searchTerm);
  console.log(searchTerm);
  return NextResponse.json(users);
}

// POST /api/users – register a new user
export async function POST(request) {
  const { username, email, password, bio, profilePicture } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Username, email, and password are required." }, { status: 400 });
  }

  if (password.length < 4) {
    return NextResponse.json({ error: "Password must be at least 4 characters." }, { status: 400 });
  }

  try {
    const user = await usersRepo.register({ username, email, password, bio, profilePicture });
    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
