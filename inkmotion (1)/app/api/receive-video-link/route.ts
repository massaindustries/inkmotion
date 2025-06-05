import { videoResults } from "../generate-video/route"

export async function POST(request: Request) {
  try {
    console.log("=== RECEIVING VIDEO LINK ===")
    console.log("Request headers:", Object.fromEntries(request.headers.entries()))

    const contentType = request.headers.get("content-type")
    let body: any

    try {
      if (contentType && contentType.includes("application/json")) {
        body = await request.json()
      } else {
        const text = await request.text()
        console.log("Non-JSON body received:", text)

        // Try to parse as JSON anyway
        try {
          body = JSON.parse(text)
        } catch {
          // If it's not JSON, treat it as a simple string (maybe just the URL)
          body = { videoUrl: text.trim() }
        }
      }
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return Response.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    console.log("Received video link data:", body)

    // Extract video URL and session ID from the request body
    const videoUrl = body.videoUrl || body.video_url || body.url || body.link || body.videoLink
    const sessionId = body.sessionId || body.session_id || body.sessionID

    if (!videoUrl) {
      console.error("No video URL found in request body:", body)
      return Response.json({ success: false, error: "No video URL provided" }, { status: 400 })
    }

    if (!sessionId) {
      console.error("No session ID found in request body:", body)

      // If no session ID, try to find the most recent session
      const sessions = Array.from(videoResults.keys())
      if (sessions.length === 0) {
        console.error("No active sessions found")
        return Response.json(
          { success: false, error: "No session ID provided and no active sessions" },
          { status: 400 },
        )
      }

      // Use the most recent session (this is a fallback)
      const latestSession = sessions[sessions.length - 1]
      console.log("Using latest session as fallback:", latestSession)

      videoResults.set(latestSession, {
        videoUrl: videoUrl,
        timestamp: Date.now(),
      })

      return Response.json({
        success: true,
        message: "Video URL received successfully (used latest session as fallback)",
        sessionId: latestSession,
        timestamp: new Date().toISOString(),
      })
    }

    // Validate video URL format
    try {
      new URL(videoUrl)
    } catch {
      console.error("Invalid video URL format:", videoUrl)
      return Response.json({ success: false, error: "Invalid video URL format" }, { status: 400 })
    }

    // Store the video URL with session ID
    videoResults.set(sessionId, {
      videoUrl: videoUrl,
      timestamp: Date.now(),
    })

    console.log("Video URL stored successfully for session:", sessionId, videoUrl)

    return Response.json({
      success: true,
      message: "Video URL received successfully",
      sessionId: sessionId,
      videoUrl: videoUrl,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error receiving video link:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to process video link",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get("sessionId")

    if (!sessionId) {
      // Return all active sessions for debugging
      const activeSessions = Array.from(videoResults.keys())
      return Response.json(
        {
          success: false,
          error: "Session ID required",
          activeSessions: activeSessions,
          totalSessions: activeSessions.length,
        },
        { status: 400 },
      )
    }

    const result = videoResults.get(sessionId)

    if (result) {
      return Response.json({
        success: true,
        videoUrl: result.videoUrl,
        sessionId: sessionId,
        timestamp: new Date(result.timestamp).toISOString(),
      })
    }

    return Response.json(
      {
        success: false,
        message: "No video URL available for this session",
        sessionId: sessionId,
        activeSessions: Array.from(videoResults.keys()),
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("Error retrieving video link:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to retrieve video link",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
