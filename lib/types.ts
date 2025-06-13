export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "EVENT_OWNER";
  createdAt: Date;
}

export interface UserWithStats extends User {
  eventCount: number;
  totalAttendees: number;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  location?: string | null;
  description?: string | null;
  published: boolean;
  userId: string;
  attendeeCount: number;
  customFields?: CustomField[];
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface CustomField {
  name: string;
  type: "text" | "number";
  required: boolean;
}

export interface RSVP {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  customFieldData?: Record<string, any>;
  createdAt: Date;
}

export interface AttendeeWithEvent extends RSVP {
  event: {
    id: string;
    title: string;
    date: Date;
    location?: string | null;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface EventStats {
  totalEvents: number;
  eventsThisMonth: number;
  totalAttendees: number;
  attendeesThisMonth: number;
  totalViews: number;
  viewsThisMonth: number;
}
