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
            return false;
        }
        inputChars.splice(index, 1);
    }

    return true;
};

//TODO implement this function
export function grammerCheck(sentence: String) {
    return true;
}

