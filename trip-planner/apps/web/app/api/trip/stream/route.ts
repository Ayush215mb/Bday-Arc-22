export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = process.env.API_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
    const upstream = await fetch(`${API}/trip/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: await req.text(),
        signal: req.signal,
    }).catch(() => null);

    if (!upstream || !upstream.ok || !upstream.body) {
        return Response.json(
            { error: "Planner API unreachable" },
            { status: upstream?.status ?? 502 },
        );
    }

    return new Response(upstream.body, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}
