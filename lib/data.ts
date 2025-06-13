import { prisma } from "@/lib/prisma";
import type {
  Event,
  RSVP,
  EventStats,
  AttendeeWithEvent,
  UserWithStats,
} from "@/lib/types";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getAllUsers(): Promise<UserWithStats[]> {
  const users = await prisma.user.findMany({
    include: {
      events: {
        include: {
          _count: {
            select: { rsvps: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name || "",
    email: user.email,
    role: user.role as "ADMIN" | "STAFF" | "EVENT_OWNER",
    createdAt: user.createdAt,
    eventCount: user.events.length,
    totalAttendees: user.events.reduce(
      (sum, event) => sum + event._count.rsvps,
      0
    ),
  }));
}

export async function getAllAttendees(
  userId?: string
): Promise<AttendeeWithEvent[]> {
  const rsvps = await prisma.rSVP.findMany({
    where: userId ? { event: { userId } } : undefined,
    include: {
      event: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return rsvps.map((rsvp) => ({
    id: rsvp.id,
    eventId: rsvp.eventId,
    name: rsvp.name,
    email: rsvp.email,
    phone: rsvp.phone,
    customFieldData: rsvp.customFieldData as any,
    createdAt: rsvp.createdAt,
    event: {
      id: rsvp.event.id,
      title: rsvp.event.title,
      date: rsvp.event.date,
      location: rsvp.event.location,
      user: {
        id: rsvp.event.user.id,
        name: rsvp.event.user.name || "",
        email: rsvp.event.user.email,
      },
    },
  }));
}

export async function getUpcomingEvents(userId?: string): Promise<Event[]> {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      date: { gt: now },
      ...(userId && { userId }),
    },
    include: {
      _count: {
        select: { rsvps: true },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { date: "asc" },
    take: 5,
  });

  return events.map((event) => ({
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
    user: event.user,
  }));
}

export async function getAllEvents(userId?: string): Promise<Event[]> {
  const events = await prisma.event.findMany({
    where: userId ? { userId } : undefined,
    include: {
      _count: {
        select: { rsvps: true },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return events.map((event) => ({
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
    user: event.user,
  }));
}

export async function getAllPublicEvents(): Promise<Event[]> {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      published: true,
      date: { gt: now },
    },
    include: {
      _count: {
        select: { rsvps: true },
      },
    },
    orderBy: { date: "asc" },
  });

  return events.map((event) => ({
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
  }));
}

export async function getEventById(id: string): Promise<Event | null> {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      _count: {
        select: { rsvps: true },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!event) return null;

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
    user: {
      id: event.user.id,
      name: event.user.name || "",
      email: event.user.email,
      role: event.user.role as "ADMIN" | "STAFF" | "EVENT_OWNER",
    },
  };
}

export async function getEventAttendees(eventId: string): Promise<RSVP[]> {
  const rsvps = await prisma.rSVP.findMany({
    where: { eventId },
    orderBy: { createdAt: "desc" },
  });

  return rsvps.map((rsvp) => ({
    id: rsvp.id,
    eventId: rsvp.eventId,
    name: rsvp.name,
    email: rsvp.email,
    phone: rsvp.phone,
    customFieldData: rsvp.customFieldData as any,
    createdAt: rsvp.createdAt,
  }));
}

export async function getEventStats(userId?: string): Promise<EventStats> {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalEvents,
    eventsThisMonth,
    totalRSVPs,
    rsvpsThisMonth,
    totalViews,
    viewsThisMonth,
  ] = await Promise.all([
    prisma.event.count({
      where: userId ? { userId } : undefined,
    }),
    prisma.event.count({
      where: {
        ...(userId && { userId }),
        createdAt: { gte: thisMonth },
      },
    }),
    prisma.rSVP.count({
      where: userId
        ? {
            event: { userId },
          }
        : undefined,
    }),
    prisma.rSVP.count({
      where: {
        ...(userId && { event: { userId } }),
        createdAt: { gte: thisMonth },
      },
    }),
    prisma.eventView.count({
      where: userId
        ? {
            event: { userId },
          }
        : undefined,
    }),
    prisma.eventView.count({
      where: {
        ...(userId && { event: { userId } }),
        createdAt: { gte: thisMonth },
      },
    }),
  ]);

  return {
    totalEvents,
    eventsThisMonth,
    totalAttendees: totalRSVPs,
    attendeesThisMonth: rsvpsThisMonth,
    totalViews,
    viewsThisMonth,
  };
}

export async function trackEventView(
  eventId: string,
  ipAddress?: string,
  userAgent?: string
) {
  await prisma.eventView.create({
    data: {
      eventId,
      ipAddress,
      userAgent,
    },
  });
}
