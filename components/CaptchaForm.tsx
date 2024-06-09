"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import CaptchaImage from '@/components/CaptchaImage';
import { Button } from "@/components/ui/button"
import { Input } from './ui/input';

export default function CaptchaForm({ captcha, handleSubmit, isTraditional }: { captcha: string, handleSubmit: (formData: FormData) => void, isTraditional: boolean }) {
    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        let intervalId: any;
        setIsRunning(true);
        if (isRunning) {
            // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
            intervalId = setInterval(() => setTime(time + 1), 10);

        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    const [backspaceCount, setBackspaceCount] = useState(0);
    const [totalKeystrokes, setTotalKeystrokes] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    const calculateAccuracy = useCallback(() => {
        console.log(totalKeystrokes, backspaceCount);

        if (totalKeystrokes === 0) return 100;  // Return 100% accuracy if no keystrokes yet
        const correctKeystrokes = totalKeystrokes - backspaceCount;
        return (correctKeystrokes / totalKeystrokes) * 100;
    }, [totalKeystrokes, backspaceCount]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Backspace') {
                setBackspaceCount((prevCount) => prevCount + 1);
            } else {
                setTotalKeystrokes((prevCount) => prevCount + 1);
            }
            setAccuracy(calculateAccuracy());
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [calculateAccuracy]);
    const traditionalCaptchaText = "Enter the text shown in the image";
    const sentencecaptchaText = "Write a complete sentence containing all the words shown in the image";

    return (
        <form method="post" action={handleSubmit}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Captcha Verification</CardTitle>
                    {isTraditional ? <CardDescription>{traditionalCaptchaText}</CardDescription> : <CardDescription>{sentencecaptchaText}</CardDescription>}
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <input type="hidden" name="time" value={time} readOnly />
                    <input type="hidden" name="accuracy" value={accuracy} readOnly />
                    <CaptchaImage captchaText={captcha} isTraditional={isTraditional} />
                    <div className="flex w-full items-center space-x-2">
                        <Input type="text" name="captchaText" placeholder="Enter captcha text" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">Submit</Button>
                </CardFooter>

            </Card>
        </form >
    )
}
