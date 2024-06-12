import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ExperimentData, Experiment } from '@/types/experiment_data'
import { prisma } from '@/lib/db'
export default function Home() {
    async function handleSubmit(formData: FormData) {
        'use server'
        const name = formData.get('name')
        if (!name) return


        const experiments = await prisma.standardExperiments.findMany({ where: { isActivated: true } })
        var experimentArray: Experiment[] = []

        experiments.map((experiment, index) => {
            var experimentData: Experiment = {
                id: experiment.id,
                captcha: experiment.captcha,
                href: experiment.href,
                isTraditional: experiment.isTraditional,
                isCompleted: false,
                accuracy: undefined,
                time: undefined,
            }
            experimentArray.push(experimentData)

        }
        )
        let experimentData: ExperimentData = {
            userName: name.toString(),
            experiments: experimentArray
        }


        const cookieStore = cookies()
        cookieStore.set({
            name: 'experiment',
            value: JSON.stringify(experimentData),
        });
        return redirect('/experiment/experiment-list')

    }
    return (
        <div className="flex items-center justify-center h-screen">
            <form action={handleSubmit} >
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Welcome</CardTitle>
                        <CardDescription>To get started please type your name</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="flex w-full items-center space-x-2">
                            <Input name="name" type="text" placeholder="Your name" required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Start</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
