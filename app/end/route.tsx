import { prisma } from "@/lib/db";
import { grammerCheck } from "@/lib/utils"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const cookieStorage = cookies()
    const cookie = cookieStorage.get('userId');
    const userId = cookie ? cookie : '';
    if (!userId) {
        return new Response(JSON.stringify({ value: "error" }))
    }
    console.log(userId, "userId")

    await prisma.user.update({
        where: {
            id: userId.value.toString()
        },
        data: {
            endTime: new Date()
        }
    })

    return redirect('/')

}
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export const fetchCache = 'auto'


