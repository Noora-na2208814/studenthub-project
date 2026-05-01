import { PrismaLibSql } from "@prisma/adapter-libsql";
import pkg from "./client/index.js";
const { PrismaClient } = pkg;
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "",
  }),
});

async function seed() {
  // Clear existing data in correct order (respect foreign keys)
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ───────────────────────────────────────────────────────────────
  const [sara, mohammed, fatima, ali, nour, hessa, tariq, layla, omar, mariam] =
    await Promise.all([
      prisma.user.create({
        data: {
          username: "Sara Ahmed",
          email: "sara@student.edu",
          password: "1234",
          bio: "CS student who loves coding and coffee.",
          profilePicture: "",
        },
      }),
      prisma.user.create({
        data: {
          username: "Mohammed Al-Rashid",
          email: "mohammed@student.edu",
          password: "1234",
          bio: "Engineering student, building the future.",
          profilePicture: "",
        },
      }),
      prisma.user.create({
        data: {
          username: "Fatima Hassan",
          email: "fatima@student.edu",
          password: "1234",
          bio: "Math is the language of the universe.",
          profilePicture: "",
        },
      }),
      prisma.user.create({
        data: {
          username: "Ali Khalid",
          email: "ali@student.edu",
          password: "1234",
          bio: "Physics nerd and part-time stargazer.",
          profilePicture: "",
        },
      }),
      prisma.user.create({
        data: {
          username: "Nour Al-Din",
          email: "nour@student.edu",
          password: "1234",
          bio: "Literature and poetry are my passion.",
          profilePicture: "",
        },
      }),
      prisma.user.create({
        data: {
          username: "Hessa Al-Kuwari",
          email: "hessa@student.edu",
          password: "1234",
          bio: "Business student dreaming of startups.",
          profilePicture: "",
        },
      }),
      prisma.user.create({
        data: {
          username: "Tariq Mansoor",
          email: "tariq@student.edu",
          password: "1234",
          bio: "Chemistry experiments gone right... mostly.",
          profilePicture: "",
        },
      }),
      prisma.user.create({
        data: {
          username: "Layla Qassim",
          email: "layla@student.edu",
          password: "1234",
          bio: "History tells us who we are.",
          profilePicture: "",
        },
      }),
      prisma.user.create({
        data: {
          username: "Omar Al-Fahad",
          email: "omar@student.edu",
          password: "1234",
          bio: "Biology student fascinated by life.",
          profilePicture: "",
        },
      }),
      prisma.user.create({
        data: {
          username: "Mariam Jassim",
          email: "mariam@student.edu",
          password: "1234",
          bio: "Art is not what you see, but what you make others see.",
          profilePicture: "",
        },
      }),
    ]);

  // ─── Follows ─────────────────────────────────────────────────────────────
  await prisma.follows.createMany({
    data: [
      { followerId: sara.id, followingId: mohammed.id },
      { followerId: sara.id, followingId: fatima.id },
      { followerId: sara.id, followingId: hessa.id },
      { followerId: mohammed.id, followingId: sara.id },
      { followerId: mohammed.id, followingId: nour.id },
      { followerId: mohammed.id, followingId: hessa.id },
      { followerId: fatima.id, followingId: sara.id },
      { followerId: fatima.id, followingId: mohammed.id },
      { followerId: ali.id, followingId: sara.id },
      { followerId: ali.id, followingId: tariq.id },
      { followerId: nour.id, followingId: fatima.id },
      { followerId: nour.id, followingId: layla.id },
      { followerId: hessa.id, followingId: sara.id },
      { followerId: hessa.id, followingId: omar.id },
      { followerId: tariq.id, followingId: ali.id },
      { followerId: tariq.id, followingId: mariam.id },
      { followerId: layla.id, followingId: nour.id },
      { followerId: layla.id, followingId: sara.id },
      { followerId: omar.id, followingId: hessa.id },
      { followerId: omar.id, followingId: mohammed.id },
      { followerId: mariam.id, followingId: tariq.id },
      { followerId: mariam.id, followingId: fatima.id },
    ],
  });

  // ─── Posts ────────────────────────────────────────────────────────────────
  // Sara is the most active user in the last 3 months (Feb–Apr 2026)
  const p1 = await prisma.post.create({
    data: {
      userId: sara.id,
      content:
        "Just finished my first full-stack project using Next.js and Prisma! The feeling of seeing it deployed is indescribable.",
      createdAt: new Date("2026-04-20"),
    },
  });
  const p2 = await prisma.post.create({
    data: {
      userId: sara.id,
      content:
        "Study tip: the pomodoro technique has completely changed how I learn. 25 minutes of focus, 5 minute break. Try it!",
      createdAt: new Date("2026-04-10"),
    },
  });
  const p3 = await prisma.post.create({
    data: {
      userId: sara.id,
      content:
        "Attended the tech talk on AI and machine learning today. So many exciting opportunities coming our way!",
      createdAt: new Date("2026-03-15"),
    },
  });
  const p4 = await prisma.post.create({
    data: {
      userId: sara.id,
      content:
        "Databases are actually beautiful when you understand the relationships between tables. Mind blown by SQL joins today.",
      createdAt: new Date("2026-02-28"),
    },
  });
  const p5 = await prisma.post.create({
    data: {
      userId: sara.id,
      content:
        "Group project update: we finally agreed on the architecture. Microservices it is!",
      createdAt: new Date("2026-02-01"),
    },
  });
  const p6 = await prisma.post.create({
    data: {
      userId: sara.id,
      content:
        "First week of the semester done! The new courses look challenging but I am ready.",
      createdAt: new Date("2026-01-15"),
    },
  });
  const p30 = await prisma.post.create({
    data: {
      userId: sara.id,
      content:
        "Phase 2 of the project is coming together! Backend with Next.js and Prisma is so clean and organized.",
      createdAt: new Date("2026-04-25"),
    },
  });

  const p7 = await prisma.post.create({
    data: {
      userId: mohammed.id,
      content:
        "Finished my circuit design project. Spent 12 hours debugging just to find a loose wire. Engineering life!",
      createdAt: new Date("2026-04-18"),
    },
  });
  const p8 = await prisma.post.create({
    data: {
      userId: mohammed.id,
      content:
        "Teamwork makes the dream work. Shoutout to my project group for an amazing presentation today.",
      createdAt: new Date("2026-03-22"),
    },
  });
  const p9 = await prisma.post.create({
    data: {
      userId: mohammed.id,
      content:
        "Reading about sustainable energy solutions. The future of engineering is green!",
      createdAt: new Date("2026-02-14"),
    },
  });
  const p10 = await prisma.post.create({
    data: {
      userId: mohammed.id,
      content:
        "Started the semester with 3 major assignments due in week 2. Classic engineering curriculum.",
      createdAt: new Date("2026-01-20"),
    },
  });

  const p11 = await prisma.post.create({
    data: {
      userId: fatima.id,
      content:
        "Solved a differential equation that has been haunting me for a week. Pure satisfaction!",
      createdAt: new Date("2026-03-30"),
    },
  });
  const p12 = await prisma.post.create({
    data: {
      userId: fatima.id,
      content:
        "Math tutoring session went great today. Helping others understand calculus is so rewarding.",
      createdAt: new Date("2026-02-20"),
    },
  });
  const p13 = await prisma.post.create({
    data: {
      userId: fatima.id,
      content:
        "New year, new theorems to prove. Excited for the advanced topology course this semester!",
      createdAt: new Date("2026-01-05"),
    },
  });

  const p14 = await prisma.post.create({
    data: {
      userId: ali.id,
      content:
        "The double-slit experiment never gets old. Quantum mechanics is mind-bending every single time.",
      createdAt: new Date("2026-04-05"),
    },
  });
  const p15 = await prisma.post.create({
    data: {
      userId: ali.id,
      content:
        "Our lab finally got the new telescope. Cannot wait for the next clear night to use it!",
      createdAt: new Date("2026-03-01"),
    },
  });
  const p16 = await prisma.post.create({
    data: {
      userId: ali.id,
      content:
        "Particle physics seminar was incredible. We might be closer to a unified theory than I thought.",
      createdAt: new Date("2026-01-25"),
    },
  });

  const p17 = await prisma.post.create({
    data: {
      userId: nour.id,
      content:
        "Just finished reading The Alchemist for the third time. Every read reveals something new.",
      createdAt: new Date("2026-02-10"),
    },
  });
  const p18 = await prisma.post.create({
    data: {
      userId: nour.id,
      content:
        "Wrote my first short story this week. Sharing stories is how we connect as humans.",
      createdAt: new Date("2025-12-20"),
    },
  });
  const p19 = await prisma.post.create({
    data: {
      userId: nour.id,
      content:
        "The poetry workshop yesterday was magical. Words have so much power when used with intention.",
      createdAt: new Date("2025-12-05"),
    },
  });

  const p20 = await prisma.post.create({
    data: {
      userId: hessa.id,
      content:
        "Business case competition next month. Our team has been preparing for 3 weeks. Nervous but excited!",
      createdAt: new Date("2026-03-25"),
    },
  });
  const p21 = await prisma.post.create({
    data: {
      userId: hessa.id,
      content:
        "Interview tip: always research the company culture, not just their products. You are joining people!",
      createdAt: new Date("2026-02-05"),
    },
  });

  const p22 = await prisma.post.create({
    data: {
      userId: tariq.id,
      content:
        "The synthesis experiment worked perfectly today! Five attempts and we finally got it right.",
      createdAt: new Date("2026-04-12"),
    },
  });
  const p23 = await prisma.post.create({
    data: {
      userId: tariq.id,
      content:
        "Organic chemistry is brutal but beautiful. The molecular structures are like tiny works of art.",
      createdAt: new Date("2026-03-08"),
    },
  });

  const p24 = await prisma.post.create({
    data: {
      userId: layla.id,
      content:
        "Visited the national archive today for my thesis research. History is alive in those old documents!",
      createdAt: new Date("2026-04-02"),
    },
  });
  const p25 = await prisma.post.create({
    data: {
      userId: layla.id,
      content:
        "Attending a lecture on medieval Islamic architecture. Architecture and history are truly inseparable.",
      createdAt: new Date("2026-01-30"),
    },
  });

  const p26 = await prisma.post.create({
    data: {
      userId: omar.id,
      content:
        "Dissected my first specimen in the biology lab today. Fascinating and a little overwhelming!",
      createdAt: new Date("2026-03-18"),
    },
  });
  const p27 = await prisma.post.create({
    data: {
      userId: omar.id,
      content:
        "Reading about CRISPR gene editing. The future of medicine is being written right now.",
      createdAt: new Date("2026-02-22"),
    },
  });

  const p28 = await prisma.post.create({
    data: {
      userId: mariam.id,
      content:
        "Gallery opening was a success! My abstract piece got so many interesting interpretations from visitors.",
      createdAt: new Date("2026-04-08"),
    },
  });
  const p29 = await prisma.post.create({
    data: {
      userId: mariam.id,
      content:
        "Started a new watercolor series inspired by traditional Qatari patterns. Mixing old and new.",
      createdAt: new Date("2026-03-12"),
    },
  });

  // ─── Likes ────────────────────────────────────────────────────────────────
  await prisma.like.createMany({
    data: [
      // p1 – sara's deployment post
      { postId: p1.id, userId: mohammed.id },
      { postId: p1.id, userId: fatima.id },
      { postId: p1.id, userId: hessa.id },
      { postId: p1.id, userId: tariq.id },
      { postId: p1.id, userId: layla.id },
      // p2 – study tip
      { postId: p2.id, userId: mohammed.id },
      { postId: p2.id, userId: ali.id },
      { postId: p2.id, userId: omar.id },
      { postId: p2.id, userId: mariam.id },
      // p3 – AI talk
      { postId: p3.id, userId: fatima.id },
      { postId: p3.id, userId: hessa.id },
      { postId: p3.id, userId: nour.id },
      // p4 – databases
      { postId: p4.id, userId: tariq.id },
      { postId: p4.id, userId: ali.id },
      // p5 – group project
      { postId: p5.id, userId: omar.id },
      { postId: p5.id, userId: layla.id },
      // p6 – first week
      { postId: p6.id, userId: mohammed.id },
      { postId: p6.id, userId: mariam.id },
      // p7 – mohammed's circuit (most liked post with 7 likes)
      { postId: p7.id, userId: sara.id },
      { postId: p7.id, userId: ali.id },
      { postId: p7.id, userId: tariq.id },
      { postId: p7.id, userId: layla.id },
      { postId: p7.id, userId: omar.id },
      { postId: p7.id, userId: hessa.id },
      { postId: p7.id, userId: mariam.id },
      // p8 – teamwork
      { postId: p8.id, userId: sara.id },
      { postId: p8.id, userId: fatima.id },
      { postId: p8.id, userId: nour.id },
      // p11 – fatima's equation
      { postId: p11.id, userId: sara.id },
      { postId: p11.id, userId: ali.id },
      { postId: p11.id, userId: tariq.id },
      { postId: p11.id, userId: hessa.id },
      { postId: p11.id, userId: layla.id },
      { postId: p11.id, userId: omar.id },
      // p14 – ali's quantum
      { postId: p14.id, userId: sara.id },
      { postId: p14.id, userId: fatima.id },
      { postId: p14.id, userId: tariq.id },
      { postId: p14.id, userId: nour.id },
      // p17 – nour's book
      { postId: p17.id, userId: layla.id },
      { postId: p17.id, userId: mariam.id },
      { postId: p17.id, userId: sara.id },
      // p20 – hessa's competition
      { postId: p20.id, userId: sara.id },
      { postId: p20.id, userId: mohammed.id },
      { postId: p20.id, userId: omar.id },
      // p22 – tariq's synthesis
      { postId: p22.id, userId: ali.id },
      { postId: p22.id, userId: fatima.id },
      { postId: p22.id, userId: sara.id },
      // p24 – layla's archive
      { postId: p24.id, userId: nour.id },
      { postId: p24.id, userId: sara.id },
      { postId: p24.id, userId: mariam.id },
      // p28 – mariam's gallery
      { postId: p28.id, userId: sara.id },
      { postId: p28.id, userId: nour.id },
      { postId: p28.id, userId: layla.id },
      { postId: p28.id, userId: hessa.id },
      // p30 – sara's phase 2 post
      { postId: p30.id, userId: mohammed.id },
      { postId: p30.id, userId: hessa.id },
      { postId: p30.id, userId: tariq.id },
    ],
  });

  // ─── Comments ─────────────────────────────────────────────────────────────
  await prisma.comment.createMany({
    data: [
      // p1
      { postId: p1.id, userId: mohammed.id, text: "Congrats Sara! Which tech stack did you use for the backend?" },
      { postId: p1.id, userId: hessa.id, text: "Amazing work! Can you share the project link?" },
      { postId: p1.id, userId: fatima.id, text: "So proud of you, keep going!" },
      // p2
      { postId: p2.id, userId: ali.id, text: "I have been doing this for a month and it absolutely works!" },
      { postId: p2.id, userId: omar.id, text: "Great tip, going to try this for exam prep." },
      // p3
      { postId: p3.id, userId: fatima.id, text: "Wish I could have attended. Did you take any notes?" },
      { postId: p3.id, userId: tariq.id, text: "AI is definitely the future for all fields!" },
      // p4
      { postId: p4.id, userId: ali.id, text: "Wait until you try recursive queries in SQL, mind blown!" },
      { postId: p4.id, userId: tariq.id, text: "Database design really is an art form." },
      // p7 – most commented post (5 comments)
      { postId: p7.id, userId: sara.id, text: "I know that feeling of finding a loose wire after hours of debugging!" },
      { postId: p7.id, userId: tariq.id, text: "One time I debugged for 8 hours because I misspelled a variable." },
      { postId: p7.id, userId: layla.id, text: "Engineering struggles are universal, good job pushing through!" },
      { postId: p7.id, userId: hessa.id, text: "Haha been there! Great job persisting until the end." },
      { postId: p7.id, userId: fatima.id, text: "This is exactly why I chose math over engineering." },
      // p11
      { postId: p11.id, userId: sara.id, text: "That feeling when the solution finally clicks is the best!" },
      { postId: p11.id, userId: ali.id, text: "Which equation? I might need your help next time!" },
      { postId: p11.id, userId: tariq.id, text: "Differential equations are tough, well done Fatima!" },
      // p14
      { postId: p14.id, userId: sara.id, text: "Quantum mechanics is the most fascinating subject ever invented." },
      { postId: p14.id, userId: fatima.id, text: "The math behind QM is equally mind-bending!" },
      // p17
      { postId: p17.id, userId: layla.id, text: "The Alchemist changed my life too. Personal legend forever!" },
      { postId: p17.id, userId: mariam.id, text: "Great book recommendation for any art student too." },
      // p20
      { postId: p20.id, userId: sara.id, text: "You are going to crush it! We believe in you!" },
      { postId: p20.id, userId: mohammed.id, text: "Preparation is everything. Best of luck to your team!" },
      // p22
      { postId: p22.id, userId: ali.id, text: "Persistence in the lab is everything!" },
      { postId: p22.id, userId: fatima.id, text: "Molecular structures really are beautiful when you think about it." },
      // p24
      { postId: p24.id, userId: nour.id, text: "I love how history comes alive when you see primary sources!" },
      { postId: p24.id, userId: sara.id, text: "That sounds like an amazing research experience." },
      // p28
      { postId: p28.id, userId: nour.id, text: "Art speaks where words fail. Congratulations on the gallery!" },
      { postId: p28.id, userId: layla.id, text: "Wish I was there to see it in person!" },
      // p30
      { postId: p30.id, userId: mohammed.id, text: "Phase 2 already? You work so fast Sara!" },
      { postId: p30.id, userId: hessa.id, text: "Looking forward to seeing the final result!" },
    ],
  });
}

try {
  console.log("Start seeding...");
  await seed();
  await prisma.$disconnect();
  console.log("Seeding finished.");
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
