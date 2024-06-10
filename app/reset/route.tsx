import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.delete('experiment')
    return redirect('/')

}
