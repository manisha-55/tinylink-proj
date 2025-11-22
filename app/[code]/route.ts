import { prisma } from "@/lib/prisma";
export async function GET(_, {params}){
 const link = await prisma.link.findUnique({where:{code:params.code}});
 if(!link) return new Response("Not found",{status:404});
 await prisma.link.update({where:{code:params.code},data:{clicks:{increment:1},last_clicked:new Date()}});
 return Response.redirect(link.target_url);
}
