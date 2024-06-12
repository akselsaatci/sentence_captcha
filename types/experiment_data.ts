

export type ExperimentData = {
    userName: string,
    experiments: Experiment[],
}
export type Experiment = {
    captcha: string,
    id: string,
    isTraditional: boolean,
    href: string,
    isCompleted: boolean,
    accuracy: number | undefined,
    time: number | undefined,
    userResponse: string | undefined,
}

