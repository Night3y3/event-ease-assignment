"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Event, RSVP } from "@/lib/types";
import { getServerAuthSession } from "@/lib/get-server-session";
import { addEventToGoogleCalendar } from "@/lib/google-calendar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createEvent(data: any): Promise<Event> {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const event = await prisma.event.create({
    data: {
      title: data.title,
      date: new Date(data.date),
      location: data.location,
      description: data.description,
      published: data.published,
      customFields: data.customFields,
      userId: session.user.id,
    },
    include: {
      _count: {
        select: { rsvps: true },
      },
    },
  });

  revalidatePath("/dashboard/events");

  return {
    id: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
    description: event.description,
    published: event.published,
    userId: event.userId,
    attendeeCount: event._count.rsvps,
    customFields: event.customFields as any,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

export async function updateEvent(id: string, data: any): Promise<void> {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Check if user owns the event or is admin
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (
    !event ||
    (event.userId !== session.user.id && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      date: new Date(data.date),
      location: data.location,
      description: data.description,
      published: data.published,
      customFields: data.customFields,
    },
  });

  revalidatePath("/dashboard/events");
  revalidatePath(`/dashboard/events/${id}`);
}

export async function deleteEvent(id: string): Promise<void> {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Check if user owns the event or is admin
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (
    !event ||
    (event.userId !== session.user.id && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/dashboard/events");
}

export async function publishEvent(
  id: string,
  published: boolean
): Promise<void> {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Check if user owns the event or is admin/staff
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (
    !event ||
    (event.userId !== session.user.id &&
      !["ADMIN", "STAFF"].includes(session.user.role))
  ) {
    throw new Error("Unauthorized");
  }

  await prisma.event.update({
    where: { id },
    data: { published },
  });

  revalidatePath("/dashboard/events");
  revalidatePath(`/dashboard/events/${id}`);
}

export async function updateUserRole(
  userId: string,
  role: "ADMIN" | "STAFF" | "EVENT_OWNER"
): Promise<void> {
  const session = await getServerAuthSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/dashboard/users");
}

export async function submitRSVP(
  eventId: string,
  data: any,
  addToCalendar = false
): Promise<RSVP> {
  // Check if event exists and is published
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || !event.published) {
    throw new Error("Event not found or not published");
  }

  // Check if user already RSVP'd
  const existingRSVP = await prisma.rSVP.findUnique({
    where: {
      eventId_email: {
        eventId,
        email: data.email,
      },
    },
  });

  if (existingRSVP) {
    throw new Error("You have already RSVP'd to this event");
  }

  // Extract custom field data
  const { name, email, phone, ...customFieldData } = data;

  const rsvp = await prisma.rSVP.create({
    data: {
      eventId,
      name,
      email,
      phone,
      customFieldData:
        Object.keys(customFieldData).length > 0 ? customFieldData : null,
    },
  });

  // Add to Google Calendar if requested
  if (addToCalendar) {
    try {
      const session = await getServerSession(authOptions);

      if (session?.accessToken) {
        // Calculate end time (default to 2 hours after start if not specified)
        const startDateTime = new Date(event.date);
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + 2);

        await addEventToGoogleCalendar(session.accessToken, {
          title: event.title,
          description: event.description || undefined,
          location: event.location || undefined,
          startDateTime,
          endDateTime,
        });
      }
    } catch (error) {
      console.error("Failed to add event to Google Calendar:", error);
      // We don't want to fail the RSVP if calendar integration fails
    }
  }

  revalidatePath(`/dashboard/events/${eventId}`);
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard/attendees");

  return {
    id: rsvp.id,
    eventId: rsvp.eventId,
    name: rsvp.name,
    email: rsvp.email,
    phone: rsvp.phone,
    customFieldData: rsvp.customFieldData as any,
    createdAt: rsvp.createdAt,
  };
}
