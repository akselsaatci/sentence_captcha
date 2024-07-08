import { prisma } from "@/lib/db"

export async function POST(request: Request) {
    const body = await request.json()
    const captcha = body.captcha
    const userResponse = body.userResponse
    const userId = body.userId
    const experimentId = body.experimentId
    const errorType = body.errorType
    await prisma.errorLogs.create({
        data: {
            captcha: captcha,
            userResponse: userResponse,
            errorType: errorType,
            userId: userId,
            experimentId: experimentId
        }
    })
    return new Response(JSON.stringify({ value: "success" }))


}
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export const fetchCache = 'auto'

