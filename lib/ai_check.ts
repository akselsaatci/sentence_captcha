type ApiResponseType = {
    data: [
        [
            {
                Real: number;
                Fake: number;
            },
            [
                [number, number]
            ]
        ]
    ];
    is_generating: boolean;
    duration: number;
    average_duration: number;
};


type ZeroApiResponse = {
    success: boolean;
    data: {
        sentences: string[];
        isHuman: number;
        additional_feedback: string;
        h: any[];  // Replace 'any' with the specific type if known
        hi: any[];  // Replace 'any' with the specific type if known
        textWords: number;
        aiWords: number;
        fakePercentage: number;
        specialIndexes: number[];
        specialSentences: string[];
        originalParagraph: string;
        feedback: string;
        input_text: string;
        id: number;
    };
    code: number;
    message: string;
};



export default async function isWrittenByAi(s: string) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        data: [s]
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://piratexx-ai-content-detector.hf.space/run/predict", requestOptions);
        const resultText = await response.text();
        console.log(resultText);
        const result: ApiResponseType = JSON.parse(resultText) as ApiResponseType;
        if (!result) {
            throw new Error("Failed to parse response");
        }
        if (result.data[0][0].Fake > 0.6) {

            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function isWrittenByAiZero(s: string) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Origin", "https://www.zerogpt.com");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15");


    const raw = JSON.stringify({
        input_text: s
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

        try {
        const response = await fetch("https://api.zerogpt.com/api/detect/detectText", requestOptions);
        const resultText = await response.text();
        console.log(resultText);
        const result: ZeroApiResponse = JSON.parse(resultText) as ZeroApiResponse;
        if (!result) {
            throw new Error("Failed to parse response");
        }
        if (result.data.fakePercentage > 0.6) {

            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        return true;
    }
}


