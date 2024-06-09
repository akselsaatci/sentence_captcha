import React from "react"
import CaptchaForm from "@/components/CaptchaForm"
import { redirect } from "next/navigation"
import { ExperimentData } from "@/types/experiment_data"
import { cookies } from "next/headers"
import { grammerCheck, isCaptchaValid } from "@/lib/utils"
import { revalidatePath } from "next/cache"
export default function Experiment({ params }: { params: { slug: string } }) {
    const cookieStorage = cookies()
    const cookie = cookieStorage.get('experiment')
    const experimentData: ExperimentData = cookie ? JSON.parse(cookie.value) : null
    if (!experimentData) {
        redirect('/')

    }
    const index = parseInt(params.slug)
    if (index >= experimentData.experiments.length) {
        redirect('/')
    }

    const captcha = experimentData.experiments[index as number].captcha
    if (!captcha) {
        redirect('/')
    }


    async function handleSubmit(formData: FormData) {
        "use server"
        const captchaText = formData.get('captchaText')
        const time = formData.get('time')
        const cookieStorage = cookies()
        const cookie = cookieStorage.get('experiment')
        const experimentData: ExperimentData = cookie ? JSON.parse(cookie.value) : null
        const name = experimentData.userName
        const accuracy = formData.get('accuracy')
        if (!captchaText) return

        if (!isCaptchaValid(captchaText.toString(), captcha) && grammerCheck(captchaText.toString())) {
            return
        }


        console.log(captchaText, time)
        console.log(name)
        console.log(accuracy)

        const newExperimentData = {
            ...experimentData,
            experiments: experimentData.experiments.map((experiment, i) => {
                if (i === index) {
                    return {
                        ...experiment,
                        isCompleted: true,
                        accuracy: accuracy,
                        time: time,
                    }
                }
                return experiment
            })
        }
        cookieStorage.set({
            name: 'experiment',
            value: JSON.stringify(newExperimentData),
            options: {
                maxAge: 365 * 24 * 60 * 60,
                path: '/',
            },
        })
        revalidatePath('/experiment/experiment-list')
        redirect('/experiment/experiment-list')

    }


    return (
        <div className="flex items-center justify-center h-screen">
            <CaptchaForm captcha={captcha} handleSubmit={handleSubmit} />
        </div>

    )
}

