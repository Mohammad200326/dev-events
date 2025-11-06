import { connectDB } from "@/lib/mongodb";
import { EventModel } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = req.formData();

    let event;

    try {
      event = Object.fromEntries((await formData).entries());
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 }
      );
    }

    const createdEvent = await EventModel.create(event);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to create an Event",
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}
