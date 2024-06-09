import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ExperimentData } from './types/experiment_data';

export function middleware(request: NextRequest) {
    const experimentCookie = request.cookies.get('experiment');

    if (!experimentCookie) {
        const url = new URL('/', request.url);
        return NextResponse.redirect(url.toString());
    }

    try {
        const experimentData: ExperimentData = JSON.parse(experimentCookie.value);

    } catch (error) {
        const url = new URL('/', request.url);
        return NextResponse.redirect(url.toString());
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/experiment/:path*',
};
