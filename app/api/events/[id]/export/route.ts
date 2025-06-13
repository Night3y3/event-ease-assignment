import { type NextRequest, NextResponse } from "next/server";
import { getEventAttendees } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stringify } from "csv-stringify/sync";
import { formatDate } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user owns the event or is admin/staff
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (
      !event ||
      (event.userId !== session.user.id &&
        !["ADMIN", "STAFF"].includes(session.user.role))
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const attendees = await getEventAttendees(params.id);

    // Get all custom field names from all attendees
    const customFieldNames = new Set<string>();
    attendees.forEach((attendee) => {
      if (attendee.customFieldData) {
        Object.keys(attendee.customFieldData).forEach((key) => {
          customFieldNames.add(key);
        });
      }
    });

    // Create CSV header row
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "RSVP Date",
      "RSVP Time",
      ...Array.from(customFieldNames),
    ];

    // Create rows for each attendee
    const rows = attendees.map((attendee) => {
      const rsvpDate = new Date(attendee.createdAt);
      const row: Record<string, any> = {
        ID: attendee.id,
        Name: attendee.name,
        Email: attendee.email,
        Phone: attendee.phone,
        "RSVP Date": formatDate(rsvpDate),
        "RSVP Time": rsvpDate.toLocaleTimeString(),
      };

      // Add custom field values
      customFieldNames.forEach((fieldName) => {
        row[fieldName] = attendee.customFieldData?.[fieldName] || "";
      });

      return row;
    });

    // Add event information at the top
    const eventInfo = [
      { "Event Information": "" },
      { "Event Title": event.title },
      { "Event Date": formatDate(event.date) },
      { "Event Location": event.location || "N/A" },
      { "Event Organizer": event.user.name },
      { "Organizer Email": event.user.email },
      { "Total Attendees": attendees.length.toString() },
      { "Export Date": new Date().toLocaleDateString() },
      { "": "" }, // Empty row as separator
    ];

    // Generate CSV content
    const csvContent =
      stringify(eventInfo, {
        header: true,
        columns: ["Event Information", ""],
      }) +
      "\n" +
      stringify([headers]) +
      stringify(rows, { header: false });

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="attendees-${event.title
          .replace(/[^a-z0-9]/gi, "-")
          .toLowerCase()}-${params.id}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
