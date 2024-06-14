import { grammerCheck } from "@/lib/utils"

export async function POST(request: Request) {
    const body = await request.json()
    const sentence = body.sentence
    var res = await grammerCheck(sentence)

    return new Response(JSON.stringify({ value: res }))
    
}
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export const fetchCache = 'auto'







