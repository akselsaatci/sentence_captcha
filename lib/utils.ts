import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isCaptchaValid(input: String, captcha: String) {
    const inputChars = input.toLowerCase().split('');
    const captchaChars = captcha.toLowerCase().split('');

    for (let char of captchaChars) {
        const index = inputChars.indexOf(char);
        if (index === -1) {
            console.log('Character not found:', char);
            return false;
        }
        inputChars.splice(index, 1);
    }

    return true;
};

type grammerResult = {
    score: number
}

//TODO implement this function
export async function grammerCheck(sentence: String) {
    console.log('Checking grammar:', sentence);
    const url = 'http://localhost:1234/v1/chat/completions';
    const payload = {
        model: "lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF",
        messages: [
            { role: "system", content: 'You are an AI assistant that determines if a sentence is only grammatically correct. Just look for grammer. You should only respond with a score between 0 and hundred.0 is bad and 100 is good.Your respond interface is {"score" : 80}. Ignore whitespace errors.Ignore upper or lowercase errors.Focus solely on the correctness of word order.You should ignore stractural errors in the sentence.Go easy while checking.If it makes a little bit of sense it is a good sentence Do not check for clarity and coherence.' },
            { role: "user", content: sentence }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result.choices[0].message);
        const scoreJson: grammerResult = await JSON.parse(result.choices[0].message.content);
        if (scoreJson.score >= 60) {
            return true;
        }
        return false

    } catch (error) {
        console.error('Error checking grammar:', error);
        throw error;
    }
}



export async function logError(captcha: string, userResponse: string, errorType: string, experimentId: string, userId: string) {
    await fetch('/logError', { 'method': 'POST', 'body': JSON.stringify({ 'captcha': captcha, 'userResponse': userResponse, 'errorType': errorType, 'experimentId': experimentId, 'userId': userId }) });
}
