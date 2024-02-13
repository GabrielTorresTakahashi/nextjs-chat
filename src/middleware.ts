import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const response = NextResponse.next()
    const token = request.cookies.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    response.headers.set("Authorization", token.value)
    return response
}


export const config = {
    matcher: [
        '/api/((?!auth/login|auth/signup).*)',
    ]
}