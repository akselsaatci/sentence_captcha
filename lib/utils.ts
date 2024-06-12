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

//TODO implement this function
export async function grammerCheck(sentence: String) {
    return true;
    console.log('Checking grammar:', sentence);
    const url = 'http://localhost:1234/v1/chat/completions';
    const payload = {
        model: "lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF",
        messages: [
            { role: "system", content: "You are an ai assistant that determines is the sentence is grammarely. You should only give answers as Good sentence or Bad sentence. You should only give answers such as good or bad nothing more. Also you should ignore white space errors and upper or lowercase errors. You don't have to be too much strict about it. You should only check if the word order is correct. Dont check for clarity and coherence." },
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
        return result.choices[0].message.content  === 'Good sentence'; // Adjust this based on the actual response structure

    } catch (error) {
        console.error('Error checking grammar:', error);
        throw error;
    }
}

