

export type ExperimentData = {
    id: string,
    userName: string,
    experiments: Experiment[],
}
export type Experiment = {
    captcha: string,
    isTraditional: boolean,
    href: string,
    isCompleted: boolean,
    accuracy: number | undefined,
    time: number | undefined,
}

