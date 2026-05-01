import { NextResponse } from "next/server";
import usersRepo from "@/repos/users";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await usersRepo.login(email, password);
  if (!user) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }

  return NextResponse.json(user);
}
