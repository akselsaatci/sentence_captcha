import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { randomUUID } from 'crypto'
import { Experiment } from '.prisma/client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
export default function Home() {
    async function handleSubmit(formData: FormData) {
        'use server'
        const name = formData.get('name')
        if (!name) return

        const counterBalanceTable = {
            1: [
                { traditional: true, length: 5, task: 'A' },
                { traditional: false, length: 5, task: 'B' },
                { traditional: true, length: 6, task: 'C' },
                { traditional: false, length: 6, task: 'D' },
                { traditional: true, length: 7, task: 'E' },
                { traditional: false, length: 7, task: 'F' }
            ],
            2: [
                { traditional: false, length: 5, task: 'B' },
                { traditional: true, length: 6, task: 'C' },
                { traditional: false, length: 6, task: 'D' },
                { traditional: true, length: 7, task: 'E' },
                { traditional: false, length: 7, task: 'F' },
                { traditional: true, length: 5, task: 'A' }
            ],
            3: [
                { traditional: true, length: 6, task: 'C' },
                { traditional: false, length: 6, task: 'D' },
                { traditional: true, length: 7, task: 'E' },
                { traditional: false, length: 7, task: 'F' },
                { traditional: true, length: 5, task: 'A' },
                { traditional: false, length: 5, task: 'B' }
            ],
            4: [
                { traditional: false, length: 6, task: 'D' },
                { traditional: true, length: 7, task: 'E' },
                { traditional: false, length: 7, task: 'F' },
                { traditional: true, length: 5, task: 'A' },
                { traditional: false, length: 5, task: 'B' },
                { traditional: true, length: 6, task: 'C' }
            ],
            5: [
                { traditional: true, length: 7, task: 'E' },
                { traditional: false, length: 7, task: 'F' },
                { traditional: true, length: 5, task: 'A' },
                { traditional: false, length: 5, task: 'B' },
                { traditional: true, length: 6, task: 'C' },
                { traditional: false, length: 6, task: 'D' }
            ],
            6: [
                { traditional: false, length: 7, task: 'F' },
                { traditional: true, length: 5, task: 'A' },
                { traditional: false, length: 5, task: 'B' },
                { traditional: true, length: 6, task: 'C' },
                { traditional: false, length: 6, task: 'D' },
                { traditional: true, length: 7, task: 'E' }
            ],
            7: [
                { traditional: true, length: 5, task: 'A' },
                { traditional: true, length: 6, task: 'C' },
                { traditional: true, length: 7, task: 'E' },
                { traditional: false, length: 5, task: 'B' },
                { traditional: false, length: 6, task: 'D' },
                { traditional: false, length: 7, task: 'F' }
            ],
            8: [
                { traditional: false, length: 5, task: 'B' },
                { traditional: false, length: 6, task: 'D' },
                { traditional: false, length: 7, task: 'F' },
                { traditional: true, length: 6, task: 'C' },
                { traditional: true, length: 7, task: 'E' },
                { traditional: true, length: 5, task: 'A' }
            ],
            9: [
                { traditional: true, length: 6, task: 'C' },
                { traditional: true, length: 7, task: 'E' },
                { traditional: true, length: 5, task: 'A' },
                { traditional: false, length: 6, task: 'D' },
                { traditional: false, length: 7, task: 'F' },
                { traditional: false, length: 5, task: 'B' }
            ],
            10: [
                { traditional: false, length: 6, task: 'D' },
                { traditional: false, length: 7, task: 'F' },
                { traditional: false, length: 5, task: 'B' },
                { traditional: true, length: 7, task: 'E' },
                { traditional: true, length: 5, task: 'A' },
                { traditional: true, length: 6, task: 'C' }
            ],
            11: [
                { traditional: true, length: 7, task: 'E' },
                { traditional: true, length: 5, task: 'A' },
                { traditional: true, length: 6, task: 'C' },
                { traditional: false, length: 7, task: 'F' },
                { traditional: false, length: 5, task: 'B' },
                { traditional: false, length: 6, task: 'D' }
            ],
            12: [
                { traditional: false, length: 7, task: 'F' },
                { traditional: false, length: 5, task: 'B' },
                { traditional: false, length: 6, task: 'D' },
                { traditional: true, length: 5, task: 'A' },
                { traditional: true, length: 6, task: 'C' },
                { traditional: true, length: 7, task: 'E' }
            ]
        };
        const user = await prisma.user.create({
            data: {
                id: randomUUID(),
                name: name.toString(),
            }
        })
        let experiments: Experiment[] = []

        let personNumber: number = parseInt(formData.get('per_number') as string) ?? 1
        if (personNumber === undefined || personNumber === null || personNumber < 1 || personNumber > 12) {
            personNumber = 1
        }

        const counterBalance = counterBalanceTable[personNumber]
        counterBalance.forEach(async (task, index) => {
            const experiment = await prisma.experiment.create({
                data: {
                    id: randomUUID(),
                    userId: user.id,
                    accuracy: 0,
                    startTime: new Date(),
                    mistakeCount: 0,
                    isTraditional: task.traditional,
                    isCompleted: false,
                    createdAt: new Date(),
                    order: index
                }
            })
            experiments.push(experiment)
            const captchas = task.traditional ?
                await prisma.traditionalCaptchas.findMany({
                    take: 5,
                    skip: Math.floor(Math.random() * await prisma.traditionalCaptchas.count({
                        where: {
                            length: task.length
                        }
                    }) - 5),
                    where: {

                        length: task.length
                    }
                }) :
                await prisma.sentenceCaptchas.findMany({
                    take: 5,
                    skip: Math.floor(Math.random() * await prisma.sentenceCaptchas.count({ where: { length: task.length } }) - 5),
                    where: {
                        length: task.length
                    }
                })

            captchas.forEach(async (captcha) => {
                if (task.traditional) {
                    await prisma.traditionalCaptchaForExperiment.create({
                        data: {
                            captchaId: captcha.id,
                            experimentId: experiment.id,
                        }
                    })
                    console.log("traditional")
                } else {
                    await prisma.sentenceCaptchaForExperiment.create({
                        data: {
                            captchaId: captcha.id,
                            experimentId: experiment.id,
                        }
                    })
                    console.log("sentence")
                }
            })
        })



        const cookieStore = cookies()
        cookieStore.set({
            name: 'userId',
            value: user.id,
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

                        <div className="flex w-full items-center space-x-2">
                            <Select name="per_number">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Percipient number" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Percipient number</SelectLabel>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="4">4</SelectItem>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="6">6</SelectItem>
                                        <SelectItem value="7">7</SelectItem>
                                        <SelectItem value="8">8</SelectItem>
                                        <SelectItem value="9">9</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="11">11</SelectItem>
                                        <SelectItem value="12">12</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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
