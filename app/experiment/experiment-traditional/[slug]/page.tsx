import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import CaptchaForm from "@/components/CaptchaForm"
import { revalidatePath } from "next/cache"
import { grammerCheck, isCaptchaValid } from "@/lib/utils"
import { prisma } from "@/lib/db"
export default async function Experiment({ params }: { params: { slug: string } }) {
    var captchasForExperiment = await prisma.traditionalCaptchaForExperiment.findMany({
        where: {
            experimentId: params.slug
        }
    })
    var captchas = captchasForExperiment.map(async (value) => {
        var captcha = await prisma.traditionalCaptchas.findUnique({
            where: {
                id: value.captchaId
            }
        })
        return captcha?.captcha ? captcha.captcha : ""
    })

    var resolvedCaptchas = await Promise.all(captchas)
    console.log(resolvedCaptchas, "resolved captchas")

    if (!captchas) {
        redirect('/')
    }


    async function handleSubmit(formData: FormData, userAnswers: string[]) {
        "use server"

        const accuracy = formData.get('accuracy')
        var experiment = await prisma.experiment.findUnique({
            where: {
                id: params.slug
            }
        })
        if (!experiment) {
            redirect('/')
        }

        experiment.isCompleted = true
        const mistakeCount = formData.get('mistakeCount')
        const intMistakeCount = mistakeCount ? parseInt(mistakeCount.toString()) : 0

        experiment.endTime = new Date()
        experiment.accuracy = accuracy ? parseInt(accuracy.toString()) : 0
        experiment.mistakeCount = intMistakeCount

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
            <CaptchaForm captcha={resolvedCaptchas} isTraditional={true} handleSubmit={handleSubmit} />
        </div>

    )
}
