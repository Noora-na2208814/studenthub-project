import { NextResponse } from "next/server";
import statsRepo from "@/repos/stats";


export async function GET() {
  const stats = await statsRepo.getAll();
  return NextResponse.json(stats);
}
