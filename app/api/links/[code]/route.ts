import { prisma } from "@/lib/prisma";

export async function GET(_, { params }) {
  return Response.json(
    await prisma.link.findUnique({
      where: { code: params.code },
    })
  );
}

export async function DELETE(_, { params }) {
  await prisma.link.delete({
    where: { code: params.code },
  });

  return Response.json({ deleted: true });
}
