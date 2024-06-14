import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ExperimentData, Experiment } from '@/types/experiment_data'

export async function GET(request: Request) {
    const cookieStorage = cookies()
    const cookie = cookieStorage.get('experiment')
    const experimentData: ExperimentData = cookie ? JSON.parse(cookie.value) : null

    if (!experimentData) {
        return redirect('/')

    }




    return redirect('/')

}

