import { type NextRequest, NextResponse } from "next/server";
import { getAllEvents } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stringify } from "csv-stringify/sync";
import { formatDate } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all events for admin
    const events = await getAllEvents();

    // Create CSV header row
    const headers = [
      "Event ID",
      "Event Title",
      "Description",
      "Event Date",
      "Event Time",
      "Location",
      "Status",
      "Published",
      "Total Attendees",
      "Organizer Name",
      "Organizer Email",
      "Organizer Role",
      "RSVP Link",
      "Created Date",
      "Last Updated",
      "Custom Fields Count",
    ];

    // Create rows for each event
    const rows = events.map((event) => {
      const eventDate = new Date(event.date);
      const rsvpLink = `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/events/${event.id}`;

      return {
        "Event ID": event.id,
        "Event Title": event.title,
        Description: event.description || "N/A",
        "Event Date": formatDate(event.date),
        "Event Time": eventDate.toLocaleTimeString(),
        Location: event.location || "N/A",
        Status: event.published ? "Published" : "Draft",
        Published: event.published ? "Yes" : "No",
        "Total Attendees": event.attendeeCount,
        "Organizer Name": event.user?.name || "N/A",
        "Organizer Email": event.user?.email || "N/A",
        "Organizer Role": event.user?.role || "N/A",
        "RSVP Link": rsvpLink,
        "Created Date": formatDate(event.createdAt),
        "Last Updated": formatDate(event.updatedAt),
        "Custom Fields Count": event.customFields?.length || 0,
      };
    });

    // Add summary information at the top
    const totalEvents = events.length;
    const publishedEvents = events.filter((e) => e.published).length;
    const draftEvents = events.filter((e) => !e.published).length;
    const totalAttendees = events.reduce(
      (sum, event) => sum + event.attendeeCount,
      0
    );
    const uniqueOrganizers = new Set(events.map((e) => e.user?.email)).size;

    const summaryInfo = [
      { "Platform Summary": "" },
      { "Total Events": totalEvents.toString() },
      { "Published Events": publishedEvents.toString() },
      { "Draft Events": draftEvents.toString() },
      { "Total Attendees": totalAttendees.toString() },
      { "Unique Organizers": uniqueOrganizers.toString() },
      { "Export Date": new Date().toLocaleDateString() },
      { "Export Time": new Date().toLocaleTimeString() },
      { "Exported By": session.user.email },
      { "": "" }, // Empty row as separator
    ];

    // Generate CSV content
    const csvContent =
      stringify(summaryInfo, {
        header: true,
        columns: ["Platform Summary", ""],
      }) +
      "\n" +
      stringify([headers]) +
      stringify(rows, { header: false });

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="admin-all-events-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
