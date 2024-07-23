import { PrismaClient } from "@prisma/client"
import { hash } from "crypto"

const prisma = new PrismaClient()

const rmapData = {
  title: "GCSE Mathematics",
  topics: [
    {
      title: "Algebra",
      subtopics: [
        {
          title: "Solving Equations",
          resources: [
            {
              name: "BBC Bitesize - Solving Equations",
              url: "https://www.bbc.co.uk/bitesize/guides/zp48w6f/revision/1",
            },
            {
              name: "Khan Academy - Solving Linear Equations",
              url: "https://www.khanacademy.org/math/algebra/x2f8bb4f830c9fb89:solving-linear-equations-x2f8bb4f830c9fb89",
            },
          ],
        },
        {
          title: "Quadratic Equations",
          resources: [
            {
              name: "BBC Bitesize - Quadratic Equations",
              url: "https://www.bbc.co.uk/bitesize/guides/zgvt4j6/revision/1",
            },
            {
              name: "Khan Academy - Quadratic Formula",
              url: "https://www.khanacademy.org/math/algebra/x2f8bb4f830c9fb89:quadratic-equations-functions",
            },
          ],
        },
      ],
    },
    {
      title: "Geometry",
      subtopics: [
        {
          title: "Area and Perimeter",
          resources: [
            {
              name: "BBC Bitesize - Area and Perimeter",
              url: "https://www.bbc.co.uk/bitesize/guides/zgg4xfr/revision/1",
            },
            {
              name: "Khan Academy - Area and Perimeter",
              url: "https://www.khanacademy.org/math/geometry-basic-geo/basic-geo-area-and-perimeter",
            },
          ],
        },
        {
          title: "Pythagorean Theorem",
          resources: [
            {
              name: "BBC Bitesize - Pythagorean Theorem",
              url: "https://www.bbc.co.uk/bitesize/guides/zfpsfg8/revision/1",
            },
            {
              name: "Khan Academy - Pythagorean Theorem",
              url: "https://www.khanacademy.org/math/basic-geo/basic-geo-pythagorean-theorem",
            },
          ],
        },
      ],
    },
  ],
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      name: "Test Userrr",
      password: "test",
      image: null,
      initialised: false,
    },
  })
  await prisma.roadmap.create({
    data: {
      title: "test",
      user_id: user.id,
      topics: {
        create: rmapData.topics.map((topic: any) => ({
          title: topic.title,
          subtopics: {
            create: topic.subtopics.map((subtopic: any) => ({
              title: subtopic.title,
              resources: {
                create: subtopic.resources.map((resource: any) => ({
                  name: resource.name,
                  url: resource.url,
                })),
              },
            })),
          },
        })),
      },
    },
  })
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    await prisma.$disconnect()
    process.exit(1)
  })
