import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from './lib/db';

export async function middleware(request: NextRequest) {
    const experimentCookie = request.cookies.get('userId');
    console.log('MIDDLEWARE CALISTI')

    if (!experimentCookie) {
        console.log('No cookie found');
        const url = new URL('/', request.url);
        return NextResponse.redirect(url.toString());
    }

    try {
        if (!experimentCookie) {
            console.log('User not found');
            throw new Error('User not found');
        }

    } catch (error) {
        console.log(error);
        const url = new URL('/', request.url);
        return NextResponse.redirect(url.toString());
    }
    console.log('User found');

    return NextResponse.next();
}

export const config = {
    matcher: '/experiment/:path*',
};
