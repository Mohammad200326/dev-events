import mongoose, { Schema, Types, Document } from "mongoose";
import { EventModel } from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre("save", async function (next) {
  const booking = this as IBooking;

  if (booking.isModified("eventId") || booking.isNew) {
    try {
      const eventExists = await EventModel.findById(booking.eventId).select(
        "_id"
      );

      if (!eventExists) {
        const error = new Error(
          `Event with ID ${booking.eventId} does not exist`
        );
        error.name = "ValidationError";
        return next(error);
      }
    } catch {
      const validationError = new Error(
        "Invalid events ID format or database error"
      );
      validationError.name = "ValidationError";
      return next(validationError);
    }
  }

  next();
});

// Create index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// Create compound index for common queries (events bookings by date)
bookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user booking lookups
bookingSchema.index({ email: 1 });

// Enforce one booking per events per email
bookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: "uniq_event_email" }
);

export const BookingModel =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
