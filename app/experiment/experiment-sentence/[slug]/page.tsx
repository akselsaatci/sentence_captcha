import React from "react"
import CaptchaForm from "@/components/CaptchaForm"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
export default async function Experiment({ params }: { params: { slug: string } }) {


    var captchasForExperiment = await prisma.sentenceCaptchaForExperiment.findMany({
        where: {
            experimentId: params.slug
        }
    })
    var captchas = captchasForExperiment.map(async (value) => {
        var captcha = await prisma.sentenceCaptchas.findUnique({
            where: {
                id: value.captchaId
            }
        })
        return captcha?.captcha ? captcha.captcha : ""

    })

    var resolvedCaptchas = await Promise.all(captchas)

    if (!captchas) {
        redirect('/')
    }


    async function handleSubmit(formData: FormData, userAnswers: string[], notSolved: number[], captchaTimes: number[]) {
        "use server"
        const accuracy = formData.get('accuracy')
        const totalMistakeCount = formData.get('totalMistakeCount')

        var experiment = await prisma.experiment.findUnique({
            where: {
                id: params.slug
            }
        })
        if (!experiment) {
            redirect('/')
        }

        experiment.isCompleted = true
        const intMistakeCount = totalMistakeCount ? parseInt(totalMistakeCount.toString()) : 0
        const startTime = formData.get('startTime')?.toString() ?? "0"


        experiment.endTime = new Date()
        experiment.accuracy = accuracy ? parseInt(accuracy.toString()) : 0
        experiment.mistakeCount = intMistakeCount
        experiment.startTime = new Date(parseInt(startTime))


        await prisma.experiment.update({
            where: {
                id: experiment.id
            },
            data: {
                isCompleted: true,
                endTime: experiment.endTime,
                accuracy: experiment.accuracy,
                startTime: experiment.startTime,
                mistakeCount: experiment.mistakeCount,

            }
        })


        var captchasForExperiment = await prisma.sentenceCaptchaForExperiment.findMany({
            where: {
                experimentId: params.slug
            }
        })
        var captchas = captchasForExperiment.map(async (value, index) => {
            var captcha = await prisma.sentenceCaptchas.findUnique({
                where: {
                    id: value.captchaId,
                }
            })
            return captcha?.captcha ? captcha.captcha : ""

        })

        var resolvedCaptchas = await Promise.all(captchas)

        resolvedCaptchas.forEach(async (captcha, index) => {
            await prisma.sentenceCaptchaForExperiment.update({
                where: {
                    id: captchasForExperiment[index].id
                },
                data: {
                    userResponse: userAnswers[index],
                    isSolved: index in notSolved ? false : true,
                    timeSpend: captchaTimes[index] ?? 0,



                }
            })
        })

        console.log("times", captchaTimes)


        await prisma.experiment.update({
            where: {
                id: experiment.id
            },
            data: {
                isCompleted: true,
                endTime: experiment.endTime,
                accuracy: experiment.accuracy
            }
        })
        return redirect('/experiment/experiment-list')

    }


    return (
        <div className="flex items-center justify-center h-screen">
            <CaptchaForm captchas={resolvedCaptchas} isTraditional={false} handleSubmit={handleSubmit} experimentId={params.slug} />
        </div>

    )
}

