"use server";

import { BookingModel } from "@/models";
import { connectDB } from "../mongodb";

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}) => {
  try {
    await connectDB();

    await BookingModel.create({
      eventId,
      slug,
      email,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create booking: ", error);
    return { success: false };
  }
};
