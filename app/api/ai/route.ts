import { NextRequest, NextResponse } from "next/server";
import { generateLeadAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, lead } = body;

    if (action !== "summary" && action !== "followup") {
      return NextResponse.json(
        { error: "Invalid AI action" },
        { status: 400 },
      );
    }

    if (!lead || typeof lead !== "object") {
      return NextResponse.json(
        { error: "Lead data is required" },
        { status: 400 },
      );
    }

    if (!lead.name || !lead.company || !lead.event) {
      return NextResponse.json(
        { error: "Lead name, company, and event are required" },
        { status: 400 },
      );
    }

    const result = await generateLeadAI(action, lead);

    return NextResponse.json({
      result,
      source: "mock",
    });
  } catch (error) {
    console.error("AI error:", error);

    return NextResponse.json(
      { error: "Unable to generate AI response" },
      { status: 500 },
    );
  }
}