import React from 'react';
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { Experiment, ExperimentData } from '@/types/experiment_data'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function ExperimentList() {
    const cookieStorage = cookies()
    const cookie = cookieStorage.get('userId');
    const userId = cookie ? cookie : '';
    console.log(userId, "userId")
    console.log("experiment list")
    if (!userId) {
        redirect('/')
    }

    var experiments = await prisma.experiment.findMany({
        where: {
            userId: userId.value
        },
        orderBy: [{
            order: 'asc'

        }]
    })

    var captchas: any[] = []

    let captchaCount = 0


    for (let i = 0; i < experiments.length; i++) {
        if (experiments[i].isTraditional) {
            var captchasForExperiment = await prisma.traditionalCaptchaForExperiment.findMany({
                where: {
                    experimentId: experiments[i].id
                }
            })
            var captchasForExperimentData = captchasForExperiment.map(async (value) => {
                var captcha = await prisma.traditionalCaptchas.findUnique({
                    where: {
                        id: value.captchaId
                    }
                })
                return captcha?.captcha ? captcha.captcha : ""
            })
            var resolvedCaptchas = await Promise.all(captchasForExperimentData)
            captchaCount += resolvedCaptchas.length
        }
    }



    console.log(experiments.length, "experiments")

    var isAllExperimentCompleted = experiments.every((experiment) => experiment.isCompleted)

    return (
        <div className="flex px-3 lg:px-0 items-center justify-center h-screen" >
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Experiments</h1>
                <ul className="space-y-4">
                    {
                        experiments.map((experiment) => {
                            return (
                                <li key={experiment.id}>
                                    <Button asChild disabled={experiment.isCompleted} className={`w-full ${experiment.isCompleted ? 'bg-gray-500' : ''}`}>
                                        <Link href={!experiment.isCompleted ? experiment.isTraditional ? `/experiment/experiment-traditional/${experiment.id}` : `/experiment/experiment-sentence/${experiment.id}` : "#"}>
                                            Experiment Type: {experiment.isTraditional ? "Traditional" : "Sentence Captcha"}
                                        </Link>
                                    </Button>
                                </li>
                            )
                        })
                    }
                </ul>
                {captchaCount < 15 && <p className="text-sm text-red-500">Captchas Missing </p>}

            </div >
            {
                isAllExperimentCompleted && <div className="w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-4">All Experiments Completed</h1>
                    <Button asChild>
                        <Link href="/end">
                            End Experiment
                        </Link>
                    </Button>
                </div>
            }
        </div >)
}
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export const fetchCache = 'auto'

