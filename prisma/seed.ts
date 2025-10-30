import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { membersData } from "./membersData";

const prisma = new PrismaClient();

async function seedMembers() {
  return membersData.map(async (member) =>
    prisma.user.create({
      data: {
        email: member.email,
        emailVerified: new Date(),
        name: member.name,
        passwordHash: await hash("password", 10),
        image: member.image,
        member: {
          create: {
            name: member.name,
            created: new Date(member.created),
            updated: new Date(member.lastActive),
            bio: member.bio,
            age: member.age,
            image: member.image,
            photos: {
              create: {
                url: member.image,
              },
            },
          },
        },
      },
    })
  );
}

async function main() {
  await seedMembers();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
