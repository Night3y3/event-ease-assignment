const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@eventease.com" },
    update: {},
    create: {
      email: "admin@eventease.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Create event owner user
  const ownerPassword = await bcrypt.hash("owner123", 12)
  const owner = await prisma.user.upsert({
    where: { email: "owner@eventease.com" },
    update: {},
    create: {
      email: "owner@eventease.com",
      name: "Event Owner",
      password: ownerPassword,
      role: "EVENT_OWNER",
    },
  })

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
          name: "Dietary Requirements",
          type: "select",
          required: false,
          options: ["None", "Vegetarian", "Vegan", "Gluten-free"],
        },
        {
          name: "T-shirt Size",
          type: "select",
          required: true,
          options: ["XS", "S", "M", "L", "XL", "XXL"],
        },
      ],
    },
  })

  const event2 = await prisma.event.upsert({
    where: { id: "sample-event-2" },
    update: {},
    create: {
      id: "sample-event-2",
      title: "Startup Networking Event",
      date: new Date("2025-02-20T18:00:00Z"),
      location: "Downtown Business Center",
      description: "Connect with fellow entrepreneurs and investors in this exclusive networking event.",
      published: true,
      userId: owner.id,
      customFields: [
        {
          name: "Company Name",
          type: "text",
          required: false,
        },
        {
          name: "Industry",
          type: "select",
          required: false,
          options: ["Technology", "Healthcare", "Finance", "Education", "Other"],
        },
      ],
    },
  })

  // Create sample RSVPs
  await prisma.rSVP.createMany({
    data: [
      {
        eventId: event1.id,
        name: "Alice Johnson",
        email: "alice@example.com",
        customFieldData: {
          "Dietary Requirements": "Vegetarian",
          "T-shirt Size": "M",
        },
      },
      {
        eventId: event1.id,
        name: "Bob Wilson",
        email: "bob@example.com",
        customFieldData: {
          "Dietary Requirements": "None",
          "T-shirt Size": "L",
        },
      },
      {
        eventId: event2.id,
        name: "Carol Davis",
        email: "carol@example.com",
        customFieldData: {
          "Company Name": "TechStart Inc.",
          Industry: "Technology",
        },
      },
    ],
    skipDuplicates: true,
  })

  console.log("✅ Database seeded successfully!")
  console.log("\n📧 Sample login credentials:")
  console.log("Admin: admin@eventease.com / admin123")
  console.log("Event Owner: owner@eventease.com / owner123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
