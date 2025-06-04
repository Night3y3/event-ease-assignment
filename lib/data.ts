import { prisma } from "@/lib/prisma";
import type {
  Event,
  RSVP,
  EventStats,
  AttendeeWithEvent,
  UserWithStats,
} from "@/lib/types";

/**
 * Retrieves a user by email address
 * @param email - The user's email address
 * @returns User object or null if not found
 */
export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Retrieves a user by ID
 * @param id - The user's ID
 * @returns User object or null if not found
 */
export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Retrieves all users with their event statistics
 * @returns Array of users with stats
 */
export async function getAllUsers(): Promise<UserWithStats[]> {
  try {
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
      name: user.name ?? "", // Handle null values
      email: user.email,
      role: user.role as "ADMIN" | "STAFF" | "EVENT_OWNER",
      createdAt: user.createdAt,
      eventCount: user.events.length,
      totalAttendees: user.events.reduce(
        (sum, event) => sum + event._count.rsvps,
        0
      ),
    }));
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * Retrieves all attendees with event information
 * @param userId - Optional user ID to filter attendees
 * @returns Array of attendees with event details
 */
export async function getAllAttendees(
  userId?: string
): Promise<AttendeeWithEvent[]> {
  try {
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
      customFieldData: rsvp.customFieldData as Record<string, any>,
      createdAt: rsvp.createdAt,
      event: {
        id: rsvp.event.id,
        title: rsvp.event.title,
        date: rsvp.event.date,
        location: rsvp.event.location,
        user: {
          id: rsvp.event.user.id,
          name: rsvp.event.user.name ?? "", // Handle null values
          email: rsvp.event.user.email,
        },
      },
    }));
  } catch (error) {
    console.error("Error fetching attendees:", error);
    throw new Error("Failed to fetch attendees");
  }
}

/**
 * Retrieves upcoming events
 * @param userId - Optional user ID to filter events
 * @returns Array of upcoming events
 */
export async function getUpcomingEvents(userId?: string): Promise<Event[]> {
  try {
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
      user: {
        id: event.user.id,
        name: event.user.name ?? "", // Handle null values
        email: event.user.email,
        role: event.user.role,
      },
    }));
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw new Error("Failed to fetch upcoming events");
  }
}

/**
 * Retrieves all events
 * @param userId - Optional user ID to filter events
 * @returns Array of all events
 */
export async function getAllEvents(userId?: string): Promise<Event[]> {
  try {
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
      user: {
        id: event.user.id,
        name: event.user.name ?? "", // Handle null values
        email: event.user.email,
        role: event.user.role,
      },
    }));
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw new Error("Failed to fetch events");
  }
}

/**
 * Retrieves all published public events
 * @returns Array of public events
 */
export async function getAllPublicEvents(): Promise<Event[]> {
  try {
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
      user: event.user
        ? {
            id: event.user.id,
            name: event.user.name ?? "", // Handle null values
            email: event.user.email,
            role: event.user.role,
          }
        : undefined,
    }));
  } catch (error) {
    console.error("Error fetching public events:", error);
    throw new Error("Failed to fetch public events");
  }
}

/**
 * Retrieves a single event by ID
 * @param id - The event ID
 * @returns Event object or null if not found
 */
export async function getEventById(id: string): Promise<Event | null> {
  try {
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
      user: event.user
        ? {
            id: event.user.id,
            name: event.user.name ?? "", // Handle null values
            email: event.user.email,
            role: event.user.role,
          }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw new Error("Failed to fetch event");
  }
}

/**
 * Retrieves all attendees for a specific event
 * @param eventId - The event ID
 * @returns Array of RSVPs for the event
 */
export async function getEventAttendees(eventId: string): Promise<RSVP[]> {
  try {
    const rsvps = await prisma.rSVP.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    return rsvps.map((rsvp) => ({
      id: rsvp.id,
      eventId: rsvp.eventId,
      name: rsvp.name,
      email: rsvp.email,
      customFieldData: rsvp.customFieldData as Record<string, any>,
      createdAt: rsvp.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching event attendees:", error);
    throw new Error("Failed to fetch event attendees");
  }
}

/**
 * Retrieves event statistics
 * @param userId - Optional user ID to filter stats
 * @returns Event statistics object
 */
export async function getEventStats(userId?: string): Promise<EventStats> {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const whereClause = userId ? { userId } : undefined;
    const rsvpWhereClause = userId ? { event: { userId } } : undefined;
    const viewWhereClause = userId ? { event: { userId } } : undefined;

    const [
      totalEvents,
      eventsThisMonth,
      totalRSVPs,
      rsvpsThisMonth,
      totalViews,
      viewsThisMonth,
    ] = await Promise.all([
      prisma.event.count({
        where: whereClause,
      }),
      prisma.event.count({
        where: {
          ...whereClause,
          createdAt: { gte: thisMonth },
        },
      }),
      prisma.rSVP.count({
        where: rsvpWhereClause,
      }),
      prisma.rSVP.count({
        where: {
          ...rsvpWhereClause,
          createdAt: { gte: thisMonth },
        },
      }),
      prisma.eventView.count({
        where: viewWhereClause,
      }),
      prisma.eventView.count({
        where: {
          ...viewWhereClause,
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
  } catch (error) {
    console.error("Error fetching event stats:", error);
    throw new Error("Failed to fetch event statistics");
  }
}

/**
 * Tracks an event view for analytics
 * @param eventId - The event ID
 * @param ipAddress - Optional IP address of the viewer
 * @param userAgent - Optional user agent string
 */
export async function trackEventView(
  eventId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await prisma.eventView.create({
      data: {
        eventId,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });
  } catch (error) {
    console.error("Error tracking event view:", error);
    // Don't throw here as view tracking shouldn't break the main flow
  }
}
