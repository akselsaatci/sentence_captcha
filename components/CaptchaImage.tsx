"use client"
import React, { useRef, useEffect } from "react";

interface CaptchaImageProps {
captchaText: string;
isTraditional: boolean;
}

export default function CaptchaImage(props: CaptchaImageProps) {
const canvasRef = useRef<HTMLCanvasElement | null>(null);

const drawCaptchaOnCanvas = (ctx: CanvasRenderingContext2D, captcha: string) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const textColors = ['rgb(0,0,0)', 'rgb(130,130,130)'];
        const letterSpace = 150 / captcha.length;
        for (let i = 0; i < captcha.length; i++) {
            const xInitialSpace = 25;
            ctx.font = '20px Roboto Mono';
            if (props.isTraditional) {
                ctx.fillStyle = textColors[Math.floor(Math.random() * 2)];
            }

            else {
                ctx.fillStyle = textColors[0];
            }
            if (props.isTraditional) {
                ctx.fillText(
                    captcha[i],
                    xInitialSpace + i * letterSpace,
                    Math.floor(Math.random() * 16 + 25),
                    100
                );
            }
            else {
                ctx.fillText(
                    captcha[i],
                    xInitialSpace + i * letterSpace,

                    100
                );
            }


        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                drawCaptchaOnCanvas(ctx, props.captchaText);
            }
        }
    }, [props.captchaText]);

    return (
        <canvas ref={canvasRef}>
        </canvas>
    );
};

