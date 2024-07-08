"use client"
import React, { useCallback, useEffect, useState, useReducer } from 'react';
import { Loader2 } from "lucide-react"

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
import { isCaptchaValid, logError } from '@/lib/utils';

import CaptchaImageSentence from './SentenceCaptchaImage';


export default function CaptchaForm({ captchas, handleSubmit, isTraditional, experimentId }: { captchas: string[], handleSubmit: (formData: FormData, userResponses: string[], notSolved: number[], captchaTimes: number[]) => void, isTraditional: boolean, experimentId: string }) {
    async function handleFiveErrors() {
        console.log(captchaState[currentIndex].length, "length")
        var newCaptcha = await fetch('/generate-new-captcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ experimentId: experimentId, length: captchaState[currentIndex].length }),
        })
        var jsonRes = await newCaptcha.json()


        setUserInputs([...userInputs, captchaInput])
        setCaptchaState([...captchaState, jsonRes.value])
        setCaptchaTimes([...captchaTimes, Date.now() - captchaStartTime])
        console.log(jsonRes.value, "newCaptcha")
        console.log(captchaState, "captchaState")
        setNotSolved([...notSolved, currentIndex])
        setIndex(currentIndex + 1)
        setSecError('')
        setMistakeCount(0)
        setCaptchaInput("")
    }
    let userId = ''
    if (document) {

        userId = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userId='))?.split('=')[1] ?? '';

    }

    const [time, setTime] = useState<number>(0);
    const [captchaStartTime, setCaptchStartTime] = useState<number>(0)
    const [captchaTimes, setCaptchaTimes] = useState<number[]>([])
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [backspaceCount, setBackspaceCount] = useState(0);
    const [totalKeystrokes, setTotalKeystrokes] = useState(0);
    const [notSolved, setNotSolved] = useState<number[]>([])
    const [accuracy, setAccuracy] = useState(100);
    const [currentIndex, setIndex] = useState(0)
    const [secError, setSecError] = useState('')
    const [captchaInput, setCaptchaInput] = useState<string>("");
    const [userInputs, setUserInputs] = useState<string[]>([])
    const [mistakeCount, setMistakeCount] = useState(0)
    const [captchaState, setCaptchaState] = useState<string[]>(captchas)
    const [totalMistakeCount, setTotalMistakeCount] = useState(0)
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

        console.log(startTime, "start")
        setIsLoading(true)
        if (isTraditional) {
            if (captchaInput === captchaState[currentIndex]) {
                setCaptchaTimes([...captchaTimes, Date.now() - captchaStartTime])
                console.log(captchaTimes, "captchaTimes")
                if (currentIndex === captchaState.length - 1) {
                    userInputs.push(captchaInput)
                    captchaTimes.push(Date.now() - captchaStartTime)
                    formRef.current?.requestSubmit()
                    setIsLoading(false)
                    return
                }
                setIndex(currentIndex + 1)
                setCaptchaInput("")
                setUserInputs([...userInputs, captchaInput])
                setMistakeCount(0)
                setIsLoading(false)
                return
            }
            else {
                setMistakeCount(mistakeCount + 1)
                setTotalMistakeCount(totalMistakeCount + 1)
                setSecError('Invalid Captcha')
                setIsLoading(false)
                logError(captchaState[currentIndex], captchaInput, 'User Error Traditional', experimentId, userId?.toString() ?? '')

                return
            }
        }
        else {
            if (isCaptchaValid(captchaInput, captchaState[currentIndex])) {
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

                    var resAiCheck = await fetch('/ai-check', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ sentence: captchaInput }),
                    })
                    var dataAiCheck = await resAiCheck.json()
                    console.log(dataAiCheck, "dataAiCheck")
                    if (dataAiCheck.value === true) {
                        setCaptchaTimes([...captchaTimes, Date.now() - captchaStartTime])
                        console.log(captchaTimes, "captchaTimes")
                        if (currentIndex === captchaState.length - 1) {
                            userInputs.push(captchaInput)
                            captchaTimes.push(Date.now() - captchaStartTime)
                            formRef.current?.requestSubmit()
                            return
                        }
                        setIndex(currentIndex + 1)
                        setSecError('')
                        setMistakeCount(0)
                        setCaptchaInput("")
                        setUserInputs([...userInputs, captchaInput])
                        setIsLoading(false)

                        return
                    }
                    else {
                        setTotalMistakeCount(totalMistakeCount + 1)
                        setMistakeCount(mistakeCount + 1)
                        if (mistakeCount === 4) {
                            handleFiveErrors()
                            setIsLoading(false)
                            return
                        }
                        await logError(captchaState[currentIndex], captchaInput, 'AI Error', experimentId, userId?.toString() ?? '')
                        setSecError('Invalid Captcha')
                        setIsLoading(false)

                        return
                    }
                }
                else {
                    setTotalMistakeCount(totalMistakeCount + 1)
                    setMistakeCount(mistakeCount + 1)
                    if (mistakeCount === 4) {
                        handleFiveErrors()
                        setIsLoading(false)

                        return
                    }

                    await logError(captchaState[currentIndex], captchaInput, 'Grammer Error', experimentId, userId?.toString() ?? '')
                    setSecError('Invalid Captcha')
                    setIsLoading(false)

                    return
                }
            }
            else {
                setTotalMistakeCount(totalMistakeCount + 1)
                setMistakeCount(mistakeCount + 1)
                if (mistakeCount === 4) {
                    handleFiveErrors()
                    setIsLoading(false)

                    return
                }

                await logError(captchaState[currentIndex], captchaInput, 'User Error', experimentId, userId?.toString() ?? '')
                setIsLoading(false)

                setSecError('Invalid Captcha')
                return
            }
        }
    }
    useEffect(() => {
        setStartTime(Date.now())
        setCaptchStartTime(Date.now())
        console.log(startTime, "start")
    }, [])
    useEffect(() => {
        setCaptchStartTime(Date.now())
    }
        , [currentIndex])
    const [startTime, setStartTime] = useState<number>(0);
    function handleClientSubmit(formData: FormData) {
        if (userInputs.length !== captchaState.length) {
            console.log(userInputs, captchaState)
            setSecError('Please complete all the captchas')
            console.log(captchaTimes, "captchaTimes")

            return
        }
        handleSubmit(formData, userInputs, notSolved, captchaTimes);
    }


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();  // Prevent the default form submission
            handleNextButtonClick();


        }
    };

    return (
        <form method="post" ref={formRef} action={handleClientSubmit}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl"> {isTraditional ? 'Traditional' : 'Sentence'} Captcha Verification With {captchaState[currentIndex].length} Letters</CardTitle>
                    {isTraditional ? <CardDescription>{traditionalCaptchaText}</CardDescription> : <CardDescription>{sentencecaptchaText}</CardDescription>}
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <input type="hidden" name="time" value={time} readOnly />
                    <input type="hidden" name="accuracy" value={accuracy} readOnly />
                    <input type="hidden" name="mistakeCount" value={mistakeCount} readOnly />
                    <input type="hidden" name="captchaType" value={isTraditional ? 'traditional' : 'sentence'} readOnly />
                    <input type="hidden" name="startTime" value={startTime} readOnly />
                    <input type="hidden" name="captchaStartTime" value={captchaStartTime} readOnly />
                    <input type="hidden" name="totalMistakeCount" value={totalMistakeCount} readOnly />

                    {isTraditional ?

                        <CaptchaImage captchaText={captchaState[currentIndex]} isTraditional={isTraditional} />
                        :
                        <CaptchaImageSentence captchaText={captchaState[currentIndex]} isTraditional={isTraditional} />
                    }
                    <div className="flex w-full items-center space-x-2">
                        <Input type="text" name="captchaText" onKeyPress={handleKeyPress} placeholder="Enter captcha text" value={captchaInput} onChange={handleCaptchaInputChange} required />
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
                    {isLoading ?
                        <Button className='w-full' disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button> :
                        currentIndex === captchaState.length - 1 ? <Button type="button" onClick={() => { handleNextButtonClick(); }} className="w-full">Submit</Button> : <Button type='button' onClick={() => { handleNextButtonClick() }} className="w-full">Next</Button>}

                    <br />
                </CardFooter>
                <div className='text-center pb-5 w-full block'>{currentIndex + 1}/{captchaState.length}</div>

            </Card>
        </form >
    )
}
