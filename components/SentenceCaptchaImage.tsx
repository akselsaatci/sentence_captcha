import React from "react";

interface CaptchaImageProps {
    captchaText: string;
    isTraditional: boolean;
}

export default function CaptchaImageSentence(props: CaptchaImageProps) {

    return (
        <div>
            <h2 className="text-lg"><b>These are your letters : </b> {props.captchaText}</h2>

        </div>
    )
}
