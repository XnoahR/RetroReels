import { PrismaClient } from "../../prisma/generated/client.js";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding VHS Designs...");

//   await prisma.vHSDesign.deleteMany();

  const designs = [
    {
      name: "Retro Noir",
      titleBackgroundColor: "bg-zinc-900",
      baseColor: "bg-zinc-800",
      borderColor: "border-amber-400",
      discColor: "bg-amber-400",
      sideColor: "bg-zinc-700",
    },
    {
      name: "Vapor Pink",
      titleBackgroundColor: "bg-fuchsia-900",
      baseColor: "bg-fuchsia-800",
      borderColor: "border-pink-400",
      discColor: "bg-pink-400",
      sideColor: "bg-fuchsia-700",
    },
    {
      name: "Ocean Blue",
      titleBackgroundColor: "bg-sky-900",
      baseColor: "bg-sky-800",
      borderColor: "border-cyan-400",
      discColor: "bg-cyan-400",
      sideColor: "bg-sky-700",
    },
    {
      name: "Neon Night",
      titleBackgroundColor: "bg-black",
      baseColor: "bg-zinc-900",
      borderColor: "border-lime-400",
      discColor: "bg-lime-400",
      sideColor: "bg-zinc-800",
    },
  ];

  for (const design of designs) {
  await prisma.vHSDesign.create({
    data: design,
  });
}


  console.log("✅ VHS Designs seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
