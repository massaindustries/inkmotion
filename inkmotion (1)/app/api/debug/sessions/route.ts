import { videoResults } from "../../generate-video/route"

export async function GET() {
  try {
    const sessions = Array.from(videoResults.entries()).map(([sessionId, result]) => ({
      sessionId,
      videoUrl: result.videoUrl,
      timestamp: new Date(result.timestamp).toISOString(),
      age: Date.now() - result.timestamp,
    }))

    return Response.json({
      success: true,
      totalSessions: sessions.length,
      sessions: sessions,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

export async function DELETE() {
  try {
    const sessionCount = videoResults.size
    videoResults.clear()

    return Response.json({
      success: true,
      message: `Cleared ${sessionCount} sessions`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
