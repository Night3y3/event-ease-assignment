const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@eventease.com" },
    update: {},
    create: {
      email: "admin@eventease.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create event owner user
  const ownerPassword = await bcrypt.hash("owner123", 12);
  const owner = await prisma.user.upsert({
    where: { email: "owner@eventease.com" },
    update: {},
    create: {
      email: "owner@eventease.com",
      name: "Event Owner",
      password: ownerPassword,
      role: "EVENT_OWNER",
    },
  });

  // Create sample events
  const event1 = await prisma.event.upsert({
    where: { id: "sample-event-1" },
    update: {},
    create: {
      id: "sample-event-1",
      title: "Annual Tech Conference 2025",
      date: new Date("2025-03-15T09:00:00Z"),
      location: "San Francisco Convention Center",
      description:
        "Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.",
      published: true,
      userId: owner.id,
      customFields: [
        {
          name: "Phone Number",
          type: "text",
          required: false,
        },
        {
          name: "Years of Experience",
          type: "number",
          required: true,
        },
      ],
    },
  });

  const event2 = await prisma.event.upsert({
    where: { id: "sample-event-2" },
    update: {},
    create: {
      id: "sample-event-2",
      title: "Startup Networking Event",
      date: new Date("2025-02-20T18:00:00Z"),
      location: "Downtown Business Center",
      description:
        "Connect with fellow entrepreneurs and investors in this exclusive networking event.",
      published: true,
      userId: owner.id,
      customFields: [
        {
          name: "Company Name",
          type: "text",
          required: false,
        },
        {
          name: "Number of Employees",
          type: "number",
          required: false,
        },
      ],
    },
  });

  // Create sample RSVPs
  await prisma.rSVP.createMany({
    data: [
      {
        eventId: event1.id,
        name: "Alice Johnson",
        email: "alice@example.com",
        customFieldData: {
          "Phone Number": "+1-555-0123",
          "Years of Experience": "5",
        },
      },
      {
        eventId: event1.id,
        name: "Bob Wilson",
        email: "bob@example.com",
        customFieldData: {
          "Phone Number": "+1-555-0456",
          "Years of Experience": "8",
        },
      },
      {
        eventId: event2.id,
        name: "Carol Davis",
        email: "carol@example.com",
        customFieldData: {
          "Company Name": "TechStart Inc.",
          "Number of Employees": "25",
        },
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📧 Sample login credentials:");
  console.log("Admin: admin@eventease.com / admin123");
  console.log("Event Owner: owner@eventease.com / owner123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
