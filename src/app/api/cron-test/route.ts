import { NextResponse } from "next/server";

export async function GET() {
  console.log("Cron test ran at", new Date().toISOString());
  return NextResponse.json({
    message: "Cron test ran",
    time: new Date().toISOString(),
  });
}
