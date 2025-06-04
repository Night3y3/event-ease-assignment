import { google } from "googleapis";

export async function addEventToGoogleCalendar(
  accessToken: string,
  eventDetails: {
    title: string;
    description?: string;
    location?: string;
    startDateTime: Date;
    endDateTime: Date;
  }
) {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: eventDetails.title,
      description: eventDetails.description || "",
      location: eventDetails.location || "",
      start: {
        dateTime: eventDetails.startDateTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: eventDetails.endDateTime.toISOString(),
        timeZone: "UTC",
      },
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding event to Google Calendar:", error);
    throw new Error("Failed to add event to Google Calendar");
  }
}
