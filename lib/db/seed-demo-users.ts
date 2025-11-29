/**
 * Seed Demo Users for Arogya Mitra Platform
 * 
 * Run with: npx tsx lib/db/seed-demo-users.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { user } from "./schema";
import { generateHashedPassword } from "./utils";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

const demoUsers = [
  {
    email: "admin@arogya.gov.in",
    password: "demo123",
    role: "admin" as const,
    name: "System Administrator",
    phone: "+91 9876543210",
    district: "Pune",
  },
  {
    email: "officer@arogya.gov.in",
    password: "demo123",
    role: "officer" as const,
    name: "Dr. Rajesh Patil",
    phone: "+91 9876543211",
    district: "Pune",
  },
  {
    email: "officer2@arogya.gov.in",
    password: "demo123",
    role: "officer" as const,
    name: "Dr. Suresh More",
    phone: "+91 9876543215",
    district: "Nagpur",
  },
  {
    email: "asha@arogya.gov.in",
    password: "demo123",
    role: "asha" as const,
    name: "Sunita Devi",
    phone: "+91 9876543212",
    district: "Pune",
  },
  {
    email: "asha2@arogya.gov.in",
    password: "demo123",
    role: "asha" as const,
    name: "Rekha Jadhav",
    phone: "+91 9876543213",
    district: "Nashik",
  },
  {
    email: "citizen@example.com",
    password: "demo123",
    role: "citizen" as const,
    name: "Amit Kumar",
    phone: "+91 9876543214",
    district: "Mumbai",
  },
  {
    email: "citizen2@example.com",
    password: "demo123",
    role: "citizen" as const,
    name: "Priya Sharma",
    phone: "+91 9876543216",
    district: "Thane",
  },
];

async function seedDemoUsers() {
  console.log("🌱 Seeding demo users...\n");

  for (const demoUser of demoUsers) {
    try {
      // Check if user exists
      const existingUsers = await db
        .select()
        .from(user)
        .where(eq(user.email, demoUser.email));

      if (existingUsers.length > 0) {
        // Update existing user with role info AND password
        const hashedPassword = generateHashedPassword(demoUser.password);
        await db
          .update(user)
          .set({
            password: hashedPassword,
            role: demoUser.role,
            name: demoUser.name,
            phone: demoUser.phone,
            district: demoUser.district,
          })
          .where(eq(user.email, demoUser.email));
        console.log(`🔄 Updated: ${demoUser.email} (${demoUser.role})`);
      } else {
        // Insert new user
        const hashedPassword = generateHashedPassword(demoUser.password);
        await db.insert(user).values({
          email: demoUser.email,
          password: hashedPassword,
          role: demoUser.role,
          name: demoUser.name,
          phone: demoUser.phone,
          district: demoUser.district,
        });
        console.log(`✅ Created: ${demoUser.email} (${demoUser.role})`);
      }
    } catch (error) {
      console.log(`⚠️  Error with ${demoUser.email}:`, error);
    }
  }

  console.log("\n📊 Demo Users Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Role\t\tEmail\t\t\t\t\tPassword");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  demoUsers.forEach((u) => {
    console.log(`${u.role}\t\t${u.email}\t\t${u.password}`);
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  await client.end();
  console.log("\n✨ Demo users seeded successfully!");
}

seedDemoUsers().catch(console.error);
