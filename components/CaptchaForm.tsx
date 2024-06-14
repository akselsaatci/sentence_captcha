"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import CaptchaImage from '@/components/CaptchaImage';
import { Button } from "@/components/ui/button"
import { Input } from './ui/input';
import { useSearchParams } from 'next/navigation';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export default function CaptchaForm({ captcha, handleSubmit, isTraditional }: { captcha: string[], handleSubmit: (formData: FormData, userResponses: string[]) => void, isTraditional: boolean }) {
    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [backspaceCount, setBackspaceCount] = useState(0);
    const [totalKeystrokes, setTotalKeystrokes] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [currentIndex, setIndex] = useState(0)
    const [secError, setSecError] = useState('')
    const [captchaInput, setCaptchaInput] = useState<string>("");
    const [userInputs, setUserInputs] = useState<string[]>([])
    const [mistakeCount, setMistakeCount] = useState(0)
    const formRef = React.useRef<HTMLFormElement>(null);
    const traditionalCaptchaText = "Enter the text shown in the image";
    const sentencecaptchaText = "Write a complete sentence containing all the words shown in the image";

    const searchParams = useSearchParams()

    const errorMessage = searchParams.get('err')

    useEffect(() => {
        let intervalId: any;
        setIsRunning(true);
        if (isRunning) {
            intervalId = setInterval(() => setTime(time + 1), 10);

        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);


    const calculateAccuracy = useCallback(() => {
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


    function handleCaptchaInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setCaptchaInput(event.target.value);
    }
    async function handleNextButtonClick() {
        if (isTraditional) {
            if (captchaInput === captcha[currentIndex]) {
                if (currentIndex === captcha.length - 1) {
                    userInputs.push(captchaInput)
                    formRef.current?.requestSubmit()
                    return
                }
                setIndex(currentIndex + 1)
                setCaptchaInput("")
                setUserInputs([...userInputs, captchaInput])
                return
            }
            else {
                setMistakeCount(mistakeCount + 1)
                setSecError('Invalid Captcha')
                return
            }
        }
        else {
            //TODO FIX HERE
            if (true) {
                var res = await fetch('/grammer-check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sentence: captchaInput }),
                })
                console.log(res, "res")

                var data = await res.json()
                if (data.value === true) {
                    if (currentIndex === captcha.length - 1) {
                        userInputs.push(captchaInput)
                        formRef.current?.requestSubmit()
                        return
                    }
                    setIndex(currentIndex + 1)
                    setSecError('')
                    setCaptchaInput("")
                    setUserInputs([...userInputs, captchaInput])
                    return
                }
                else {
                    setMistakeCount(mistakeCount + 1)
                    setSecError('Grammer Error')
                    return
                }
            }
            else {
                setMistakeCount(mistakeCount + 1)
                setSecError('Invalid Captcha')
                return
            }
        }
    }
    function handleClientSubmit(formData: FormData) {
        if (userInputs.length !== captcha.length) {
            console.log(userInputs, captcha)
            setSecError('Please complete all the captchas')
            return
        }
        handleSubmit(formData, userInputs);
    }

    return (
        <form method="post" ref={formRef} action={handleClientSubmit}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl"> {isTraditional ? 'Traditional' : 'Sentence'} Captcha Verification With {captcha[currentIndex].length} Letters</CardTitle>
                    {isTraditional ? <CardDescription>{traditionalCaptchaText}</CardDescription> : <CardDescription>{sentencecaptchaText}</CardDescription>}
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <input type="hidden" name="time" value={time} readOnly />
                    <input type="hidden" name="accuracy" value={accuracy} readOnly />
                    <input type="hidden" name="mistakeCount" value={mistakeCount} readOnly />
                    <CaptchaImage captchaText={captcha[currentIndex]} isTraditional={isTraditional} />
                    <div className="flex w-full items-center space-x-2">
                        <Input type="text" name="captchaText" placeholder="Enter captcha text" value={captchaInput} onChange={handleCaptchaInputChange} required />
                    </div>
                </CardContent>
                {errorMessage && <div className='p-6'> <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {errorMessage === 'invalid-captcha' ? 'Invalid Captcha' : 'Grammer Error'}
                    </AlertDescription>
                </Alert>
                </div>
                }
                {secError && <div className='p-6'> <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {secError}
                    </AlertDescription>
                </Alert>
                </div>
                }

                <CardFooter>
                    {currentIndex === captcha.length - 1 ? <Button type="button" onClick={() => { handleNextButtonClick(); }} className="w-full">Submit</Button> : <Button type='button' onClick={() => { handleNextButtonClick() }} className="w-full">Next</Button>}
                </CardFooter>

            </Card>
        </form >
    )
}
