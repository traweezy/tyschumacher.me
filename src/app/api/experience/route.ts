import { NextResponse } from "next/server";
import { experiences } from "@/data/experience";

export async function GET() {
  return NextResponse.json({ experiences });
}
