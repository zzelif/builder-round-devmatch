// prisma/seed.ts
import { PrismaClient, Gender } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const membersData = [
  {
    email: "sarah.jameson@test.com",
    username: "sarah.jameson",
    name: "Sarah Jameson",
    age: 31,
    gender: "female",
    dateOfBirth: new Date("1994-08-15"),
    created: "2024-08-15",
    lastActive: "2024-09-03",
    bio: "Sarah is a passionate nature lover who spends her weekends hiking the scenic trails of British Columbia. With a background in digital marketing, she enjoys helping small businesses grow their online presence. In her downtime, she enjoys photography and experimenting with new recipes in the kitchen.",
    city: "Burnaby",
    country: "Canada",
    image: "/images/f2.jpg",
  },
  {
    email: "karen.robertson@test.com",
    username: "karen.robertson",
    name: "Karen Robertson",
    age: 30,
    gender: "female",
    dateOfBirth: new Date("1995-01-15"),
    created: "2024-08-12",
    lastActive: "2024-09-01",
    bio: "Karen is a fitness enthusiast who has turned her love for running into a half-marathon career. Working as a software engineer, she finds a perfect balance between logic and creativity. Karen also enjoys reading mystery novels and spending quiet evenings with her rescue cat, Shadow.",
    city: "Vancouver",
    country: "Canada",
    image: "/images/f1.jpg",
  },
  {
    email: "margo.mclean@test.com",
    username: "margo.mclean",
    name: "Margo McLean",
    age: 33,
    gender: "female",
    dateOfBirth: new Date("1992-05-15"),
    created: "2024-08-22",
    lastActive: "2024-08-29",
    bio: "Margo, a graphic designer with a flair for vibrant, modern art, draws inspiration from the natural beauty of Vancouver. When she's not designing, she loves volunteering at animal shelters and participating in community art projects. Margo's easy-going personality makes her the go-to person for creative collaborations.",
    city: "Richmond",
    country: "Canada",
    image: "/images/f2.jpg",
  },
  {
    email: "lois.dawson@test.com",
    username: "lois.dawson",
    name: "Lois Dawson",
    age: 32,
    gender: "male",
    dateOfBirth: new Date("1992-11-15"),
    created: "2024-08-18",
    lastActive: "2024-08-30",
    bio: "Lois is an avid traveler who has visited over 20 countries, with his favorite being New Zealand. He works as a UX/UI designer and has a strong passion for user-centered design. In his spare time, Lois enjoys cycling around the city and exploring the Vancouver food scene with friends.",
    city: "Surrey",
    country: "Canada",
    image: "/images/m2.jpg",
  },
  {
    email: "ruthie.anderson@test.com",
    username: "ruthie.anderson",
    name: "Ruthie Anderson",
    age: 29,
    gender: "female",
    dateOfBirth: new Date("1996-11-01"),
    created: "2024-08-21",
    lastActive: "2024-09-02",
    bio: "Ruthie is a wellness coach with a passion for mindfulness and meditation. She loves helping others discover the benefits of a balanced lifestyle. When not working, Ruthie enjoys exploring Vancouver's vibrant yoga scene and spending quiet mornings by the ocean with her dog, Luna.",
    city: "West Vancouver",
    country: "Canada",
    image: "/images/f1.jpg",
  },
  {
    email: "todd.bennett@test.com",
    username: "todd.bennett",
    name: "Todd Bennett",
    age: 38,
    gender: "male",
    dateOfBirth: new Date("1987-10-15"),
    created: "2024-08-17",
    lastActive: "2024-09-03",
    bio: "Todd is a software developer who loves coding and building apps that make life easier. Outside of work, Todd enjoys woodworking and has built much of his home furniture. He also loves spending time with his two young children, introducing them to his favorite hobby—camping in the great outdoors.",
    city: "North Vancouver",
    country: "Canada",
    image: "/images/m1.jpg",
  },
  {
    email: "porter.thompson@test.com",
    username: "porter.thompson",
    name: "Porter Thompson",
    age: 25,
    gender: "prefer-not-to-say",
    dateOfBirth: new Date("1990-07-15"),
    created: "2024-08-23",
    lastActive: "2024-09-01",
    bio: "Porter is a young entrepreneur with a startup in the tech industry. Passionate about innovation, he is always on the lookout for new challenges. In his free time, Porter enjoys kayaking, attending tech meetups, and hosting game nights with friends at his home in Vancouver.",
    city: "Burnaby",
    country: "Canada",
    image: "/images/m2.jpg",
  },
  {
    email: "mayo.wilson@test.com",
    username: "mayo.wilson",
    name: "Mayo Wilson",
    age: 42,
    gender: "male",
    dateOfBirth: new Date("1982-12-15"),
    created: "2024-08-14",
    lastActive: "2024-08-30",
    bio: "Mayo is a dedicated community worker who is passionate about social causes. With a background in social work, Mayo is deeply involved in helping the homeless in Vancouver. He enjoys long hikes, playing soccer, and is always up for an adventure, whether it's traveling or exploring new local spots.",
    city: "Coquitlam",
    country: "Canada",
    image: "/images/m1.jpg",
  },
  {
    email: "skinner.jones@test.com",
    username: "skinner.jones",
    name: "Skinner Jones",
    age: 40,
    gender: "male",
    dateOfBirth: new Date("1984-12-24"),
    created: "2024-08-19",
    lastActive: "2024-09-01",
    bio: "Skinner, a mechanical engineer, has always had a passion for building things from scratch. He enjoys tinkering with old cars and dreams of restoring a classic Mustang one day. In his spare time, he enjoys watching hockey and organizing weekend road trips with friends.",
    city: "Richmond",
    country: "Canada",
    image: "/images/m2.jpg",
  },
  {
    email: "davis.harrison@test.com",
    username: "davis.harrison",
    name: "Davis Harrison",
    age: 28,
    gender: "male",
    dateOfBirth: new Date("1987-02-14"),
    created: "2024-08-20",
    lastActive: "2024-09-03",
    bio: "Davis is a high school teacher who specializes in history and social sciences. He loves sharing his passion for history with his students. On weekends, Davis enjoys hiking with his dog and practicing photography, capturing the stunning landscapes of Vancouver's mountains and forests.",
    city: "Langley",
    country: "Canada",
    image: "/images/m1.jpg",
  },
];

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
