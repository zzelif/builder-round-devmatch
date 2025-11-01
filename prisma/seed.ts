// prisma/seed.ts
import { PrismaClient, Gender } from "@prisma/client";
import { hash } from "bcryptjs";
import { membersData } from "./membersData";

const prisma = new PrismaClient();

async function seedMembers() {
  const genderMapping: Record<string, Gender> = {
    male: Gender.MALE,
    female: Gender.FEMALE,
    "non-binary": Gender.NON_BINARY,
    "prefer-not-to-say": Gender.PREFER_NOT_TO_SAY,
  };

  const promises = membersData.map(async (member) => {
    try {
      return await prisma.user.create({
        data: {
          email: member.email,
          emailVerified: new Date(),
          name: member.name,
          passwordHash: await hash("password", 10),
          image: member.image,
          profileComplete: true,
          member: {
            create: {
              name: member.name,
              created: new Date(member.created),
              updated: new Date(member.lastActive),
              bio: member.bio,
              age: member.age,
              gender: genderMapping[member.gender],
              dateOfBirth: member.dateOfBirth,
              city: member.city,
              country: member.country,
              image: member.image,
              photos: {
                create: {
                  url: member.image,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error(`Error creating user ${member.email}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  console.log(`Created ${results.filter(Boolean).length} users successfully`);
  return results;
}

async function main() {
  console.log("Starting database seeding...");

  try {
    await seedMembers();
    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Database seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
