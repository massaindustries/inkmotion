import { videoResults } from "../generate-video/route"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received video link from n8n:", data)

    // Verifica che ci siano i dati necessari
    if (!data.sessionId || !data.videoUrl) {
      console.error("Missing required fields in callback:", data)
      return Response.json(
        {
          success: false,
          error: "Missing required fields: sessionId and videoUrl",
        },
        { status: 400 },
      )
    }

    // Salva il risultato nella mappa per il polling
    videoResults.set(data.sessionId, {
      videoUrl: data.videoUrl,
      timestamp: Date.now(),
    })

    console.log(`Video URL stored for session ${data.sessionId}:`, data.videoUrl)
    console.log("Current active sessions:", videoResults.size)

    return Response.json({
      success: true,
      message: "Video link received successfully",
      sessionId: data.sessionId,
    })
  } catch (error) {
    console.error("Error processing video link callback:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process video link",
      },
      { status: 500 },
    )
  }
}

// Endpoint per debug - lista tutte le sessioni attive
export async function GET() {
  const sessions = Array.from(videoResults.entries()).map(([sessionId, data]) => ({
    sessionId,
    videoUrl: data.videoUrl,
    receivedAt: new Date(data.timestamp).toISOString(),
    ageInSeconds: Math.floor((Date.now() - data.timestamp) / 1000),
  }))

  return Response.json({
    success: true,
    activeSessions: sessions.length,
    sessions: sessions,
  })
}
