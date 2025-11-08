"use server";

import { EventModel, IEvent } from "@/models";
import { connectDB } from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await EventModel.findOne({ slug });

    return await EventModel.find<IEvent>({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean<IEvent[]>();
  } catch {
    return [];
  }
};
