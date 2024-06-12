import React from "react";


import { Experiment, ExperimentData } from '@/types/experiment_data'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

import { Button } from "@/components/ui/button"
import { StandardExperiments, User } from "@prisma/client";
import { prisma } from "@/lib/db";
export default function Page() {
    const cookieStorage = cookies()
    const cookie = cookieStorage.get('experiment')
    const experimentData: ExperimentData = cookie ? JSON.parse(cookie.value) : null
    if (!experimentData) {
        redirect('/')
    }

    async function handleSubmit(formData: FormData) {
        'use server'
        const cookieStorage = cookies()
        const cookie = cookieStorage.get('experiment')
        const experimentData: ExperimentData = cookie ? JSON.parse(cookie.value) : null
        experimentData.experiments.map((experiment: Experiment, index: number) => {
            experiment.accuracy = parseFloat(experiment.accuracy?.toString() ?? '0')
            experiment.time = parseFloat(experiment.time?.toString() ?? '0')
        })

        if (!experimentData) {
            redirect('/')
        }
        const isAllExperimentCompleted = experimentData.experiments.every((experiment: Experiment) => experiment.isCompleted)

        if (!isAllExperimentCompleted) {
            redirect('/experiment/experiment-list')
        }

        var user: User = {
            id: experimentData.userName + Math.random().toString(36).substring(7),
            name: experimentData.userName,
        }
        await prisma.user.create({
            data: user
        })
        experimentData.experiments.map(async (experiment: Experiment) => {
            console.log(typeof experiment.accuracy)
            await prisma.userExperiment.create({
                data: {
                    accuracy: experiment.accuracy ?? 0,
                    timeTaken: experiment.time ?? 0,
                    createdAt: new Date(),
                    userId: user.id,
                    experimentId: experiment.id,
                    userResponse: experiment.userResponse ?? '',

                }
            })
        }
        )
        return redirect('/reset')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full">
                <form method="post" action={handleSubmit}>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-center">Captcha Experiment Results</h1>
                        <div className="grid gap-4">
                            {experimentData.experiments.map((experiment: Experiment, index: number) => (
                                <div key={index} className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Captcha {index + 1}: {experiment.captcha}</span>
                                        <span className="font-bold">{experiment.isTraditional ? 'Traditional' : 'Sentence Captcha'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Time Taken:</span>
                                        <span className="font-bold">{experiment.time}m seconds</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Accuracy :</span>
                                        <span className="font-bold">{experiment.accuracy} % </span>
                                    </div>
                                </div>
                            ))}

                            <Button type="submit" className="w-full">Done</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

