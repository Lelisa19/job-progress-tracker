/**
 * Server-Sent Events (SSE) — proposal: real-time updates via WebSockets or SSE.
 * Browser: `new EventSource('/api/realtime/notifications')`
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ message: "connected", t: Date.now() })}\n\n`
        )
      );
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
