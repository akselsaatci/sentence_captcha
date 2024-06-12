import React from 'react';
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { Experiment, ExperimentData } from '@/types/experiment_data'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

export default async function ExperimentList() {
    const cookieStorage = cookies()
    const cookie = cookieStorage.get('experiment')
    const experimentData: ExperimentData = cookie ? JSON.parse(cookie.value) : null
    console.log(experimentData, 'experimentData')
    const isAllExperimentCompleted = experimentData.experiments.every((experiment: Experiment) => experiment.isCompleted)
    if (!experimentData) {
        redirect('/')

    }
    return (
        <div className="flex px-3 lg:px-0 items-center justify-center h-screen" >
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Experiments</h1>
                <ul className="space-y-4">
                    {experimentData.experiments.map(({ captcha, href, isTraditional, isCompleted }, index) => (
                        <li key={captcha}>
                            <Button asChild disabled={isCompleted} className={`w-full ${isCompleted ? 'bg-gray-500' : ''}`}>
                                <Link href={!isCompleted ? href : "#"}>
                                    Experiment {index + 1} Type: {isTraditional ? "Traditional" : "Sentence Captcha"}
                                </Link>
                            </Button>
                        </li>
                    ))}
                    <div>
                        <Button asChild>
                            <Link href="/reset">Reset</Link>
                        </Button>
                    </div>
                    {isAllExperimentCompleted && <Button asChild>
                        <Link href="/results">View Results</Link>
                    </Button>}

                    {!isAllExperimentCompleted && <Button disabled asChild>
                        <Link href="#">View Results</Link>
                    </Button>}


                </ul>
            </div>
        </div >)
}
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export const fetchCache = 'auto'

