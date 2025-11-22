import { generateCode } from "@/lib/generateCode";
import { prisma } from "@/lib/prisma";

export async function GET(){ return Response.json(await prisma.link.findMany()); }

export async function POST(request: Request) {
  try {
    const { target_url, code } = await request.json();

    if (!target_url || target_url.trim() === "") {
      return new Response("Target URL is required", { status: 400 });
    }

    // STEP 1: Check if target_url already exists
    const existingUrl = await prisma.link.findFirst({
      where: { target_url }
    });

    if (existingUrl) {
      return new Response(JSON.stringify(existingUrl), { status: 200 });
    }

    // STEP 2: If user provided a custom code, ensure it's unique
    if (code) {
      const existingCode = await prisma.link.findUnique({
        where: { code }
      });

      if (existingCode) {
        return new Response("Custom code already exists", { status: 409 });
      }
    }

    // STEP 3: Auto-generate unique code if not provided
    let finalCode = code || "";

    if (!finalCode) {
      while (true) {
        const temp = generateCode(6);
        const exists = await prisma.link.findUnique({
          where: { code: temp }
        });
        if (!exists) {
          finalCode = temp;
          break;
        }
      }
    }

    // STEP 4: Create new short link
    const newLink = await prisma.link.create({
      data: {
        target_url,
        code: finalCode,
      },
    });

    return new Response(JSON.stringify(newLink), { status: 201 });

  } catch (error) {
    console.error(error);
    return new Response("Server error", { status: 500 });
  }
}
