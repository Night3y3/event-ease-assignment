import { type NextRequest, NextResponse } from "next/server";
import { getAllAttendees } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stringify } from "csv-stringify/sync";
import { formatDate } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get attendees based on user role
    const attendees = await getAllAttendees(
      session.user.role === "ADMIN" ? undefined : session.user.id
    );

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
      "Attendee ID",
      "Name",
      "Email",
      "Event Title",
      "Event Date",
      "Event Location",
      "Event Organizer",
      "Organizer Email",
      "RSVP Date",
      "RSVP Time",
      "Event Status",
      ...Array.from(customFieldNames),
    ];

    // Create rows for each attendee
    const rows = attendees.map((attendee) => {
      const rsvpDate = new Date(attendee.createdAt);
      const eventDate = new Date(attendee.event.date);
      const isUpcoming = eventDate > new Date();

      const row: Record<string, any> = {
        "Attendee ID": attendee.id,
        Name: attendee.name,
        Email: attendee.email,
        "Event Title": attendee.event.title,
        "Event Date": formatDate(attendee.event.date),
        "Event Location": attendee.event.location || "N/A",
        "Event Organizer": attendee.event.user.name,
        "Organizer Email": attendee.event.user.email,
        "RSVP Date": formatDate(rsvpDate),
        "RSVP Time": rsvpDate.toLocaleTimeString(),
        "Event Status": isUpcoming ? "Upcoming" : "Past",
      };

      // Add custom field values
      customFieldNames.forEach((fieldName) => {
        row[fieldName] = attendee.customFieldData?.[fieldName] || "";
      });

      return row;
    });

    // Add summary information at the top
    const summaryInfo = [
      { "Summary Information": "" },
      { "Total Attendees": attendees.length.toString() },
      {
        "Unique Attendees": new Set(
          attendees.map((a) => a.email)
        ).size.toString(),
      },
      {
        "Total Events": new Set(
          attendees.map((a) => a.event.id)
        ).size.toString(),
      },
      { "Export Date": new Date().toLocaleDateString() },
      { "Exported By": session.user.email },
      { "": "" }, // Empty row as separator
    ];

    // Generate CSV content
    const csvContent =
      stringify(summaryInfo, {
        header: true,
        columns: ["Summary Information", ""],
      }) +
      "\n" +
      stringify([headers]) +
      stringify(rows, { header: false });

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="all-attendees-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
