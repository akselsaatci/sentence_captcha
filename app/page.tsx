import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ExperimentData } from '@/types/experiment_data'
export default function Home() {
    async function handleSubmit(formData: FormData) {
        'use server'
        const name = formData.get('name')
        if (!name) return


        var experiment: ExperimentData = {
            userName: name.toString(),
            id: '0',
            experiments: [
                {
                    captcha: 'hSdjvkJ',
                    href: '/experiment/experiment-traditional/0',
                    isTraditional: true,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                }
                ,
                {
                    captcha: 'ttoes',
                    href: '/experiment/experiment-sentence/1',
                    isTraditional: false,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'jdke82a',
                    href: '/experiment/experiment-traditional/2',
                    isTraditional: true,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'pqow39d',
                    href: '/experiment/experiment-sentence/3',
                    isTraditional: false,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'aksd83f',
                    href: '/experiment/experiment-traditional/4',
                    isTraditional: true,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'zmxl92q',
                    href: '/experiment/experiment-sentence/5',
                    isTraditional: false,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'qpdk37w',
                    href: '/experiment/experiment-traditional/6',
                    isTraditional: true,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'mxnz48v',
                    href: '/experiment/experiment-sentence/7',
                    isTraditional: false,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'plok29t',
                    href: '/experiment/experiment-traditional/8',
                    isTraditional: true,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'zxxn12y',
                    href: '/experiment/experiment-sentence/9',
                    isTraditional: false,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'lmnd84p',
                    href: '/experiment/experiment-traditional/10',
                    isTraditional: true,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'bvnm56q',
                    href: '/experiment/experiment-sentence/11',
                    isTraditional: false,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'lkoi98e',
                    href: '/experiment/experiment-traditional/12',
                    isTraditional: true,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                },
                {
                    captcha: 'rtyu67a',
                    href: '/experiment/experiment-sentence/13',
                    isTraditional: false,
                    isCompleted: false,
                    accuracy: undefined,
                    time: undefined,
                }
            ]
        }

        const cookieStore = cookies()
        cookieStore.set({
            name: 'experiment',
            value: JSON.stringify(experiment),
            options: {
                maxAge: 365 * 24 * 60 * 60, // 365 days in seconds
                path: '/',
            },
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
