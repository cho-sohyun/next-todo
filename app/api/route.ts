import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-static'
 
export async function GET(request: NextRequest) {
    const response = {
        message: 'ㅎㅎㅎ',
        data: 'zzz'
    }

    return NextResponse.json(response, { status: 200 });
}