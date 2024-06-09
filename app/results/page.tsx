import React from "react";


import { Experiment, ExperimentData } from '@/types/experiment_data'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

import { Button } from "@/components/ui/button"
export default function Page() {
    const cookieStorage = cookies()
    const cookie = cookieStorage.get('experiment')
    const experimentData: ExperimentData = cookie ? JSON.parse(cookie.value) : null
    if (!experimentData) {
        redirect('/')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full">
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
                                    <span className="font-bold">{experiment.time} seconds</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Accuracy :</span>
                                    <span className="font-bold">{experiment.accuracy} % </span>
                                </div>
                            </div>
                        ))}

                        <Button className="w-full">Done</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

