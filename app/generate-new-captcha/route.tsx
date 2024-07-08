import { prisma } from "@/lib/db";
import { SentenceCaptchaForExperiment } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const experimentId = body.experimentId;
    const length = body.length;

    const captchaCount = await prisma.sentenceCaptchas.count({ where: { length: length } });
    const randomIndex = Math.floor(Math.random() * (captchaCount - 5));
    
    const captchas = await prisma.sentenceCaptchas.findMany({
        take: 1,
        skip: randomIndex,
        where: {
            length: length,
        },
    });

    if (captchas.length === 0) {
        return new NextResponse(JSON.stringify({ error: "No captchas found" }), { status: 404 });
    }

    let result: SentenceCaptchaForExperiment;

    for (const captcha of captchas) {
        result = await prisma.sentenceCaptchaForExperiment.create({
            data: {
                captchaId: captcha.id,
                experimentId: experimentId,
            },
        });
        console.log(result, captcha);
        return new NextResponse(JSON.stringify({ value: captcha.captcha }));
    }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0;
export const fetchCache = 'auto'
