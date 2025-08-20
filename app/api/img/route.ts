// app/api/img/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return new NextResponse("Missing url", { status: 400 });

    try {
        const upstream = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://minkang.x.yupoo.com/"
            },
            next: { revalidate: 60 * 60 * 24 },
        });

        if (!upstream.ok) {
            return new NextResponse(`Upstream error: ${upstream.status}`, { status: 502 });
        }

        const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
        const buf = Buffer.from(await upstream.arrayBuffer());

        return new NextResponse(buf, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, immutable",
            },
        });
    } catch (e) {
        return new NextResponse("Proxy error", { status: 500 });
    }
}
