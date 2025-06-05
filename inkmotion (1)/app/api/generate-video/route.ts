// Store for video results with session IDs
const videoResults = new Map<string, { videoUrl: string; timestamp: number }>()

// Clean up old results every 15 minutes
setInterval(
  () => {
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000
    for (const [sessionId, result] of videoResults.entries()) {
      if (result.timestamp < fifteenMinutesAgo) {
        videoResults.delete(sessionId)
      }
    }
  },
  15 * 60 * 1000,
)

export async function POST(request: Request) {
  try {
    const { text, isBookCover, type } = await request.json()

    if (!text || text.trim().length === 0) {
      return Response.json({ success: false, error: "Text input is required" }, { status: 400 })
    }

    // Generate a unique session ID for this request
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // URL corretto del webhook n8n
    const n8nWebhookUrl = "https://massaindustries.app.n8n.cloud/webhook/short-video-text"

    console.log("=== VIDEO GENERATION REQUEST ===")
    console.log("Session ID:", sessionId)
    console.log("Text:", text.substring(0, 100) + (text.length > 100 ? "..." : ""))
    console.log("n8n Webhook URL:", n8nWebhookUrl)

    // Prepare the payload for n8n
    const payload = {
      text: text,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      source: "video-generation-platform",
      isBookCover: isBookCover || false,
      type: type || "text_input",
      // URL corretto dove n8n deve inviare il risultato
      callbackUrl: "https://v0-inkmotion.vercel.app/api/receive-link",
    }

    console.log("Sending payload to n8n:", JSON.stringify(payload, null, 2))

    try {
      // Invia la richiesta a n8n (step 1)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 810000) // 30 second timeout

      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "VideoGenerationPlatform/1.0",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("n8n Response Status:", n8nResponse.status)
      console.log("n8n Response Headers:", Object.fromEntries(n8nResponse.headers.entries()))

      // Verifica se la richiesta a n8n è andata a buon fine
      if (!n8nResponse.ok) {
        const contentType = n8nResponse.headers.get("content-type")
        let errorMessage = `HTTP ${n8nResponse.status}: ${n8nResponse.statusText}`

        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await n8nResponse.json()
            errorMessage = errorData.message || errorData.error || errorMessage
            console.error("n8n JSON Error:", errorData)
          } else {
            const errorText = await n8nResponse.text()
            console.error("n8n HTML/Text Error:", errorText.substring(0, 500))

            if (errorText.includes("<!DOCTYPE") || errorText.includes("<html")) {
              errorMessage =
                "n8n webhook returned an error page. Please check if the webhook URL is correct and active."
            } else {
              errorMessage = `n8n error: ${errorText.substring(0, 200)}`
            }
          }
        } catch (parseError) {
          console.error("Error parsing n8n error response:", parseError)
        }

        return Response.json(
          {
            success: false,
            error: errorMessage,
            sessionId: sessionId,
            debug: {
              status: n8nResponse.status,
              statusText: n8nResponse.statusText,
              contentType: contentType,
              webhookUrl: n8nWebhookUrl,
              callbackUrl: "https://v0-inkmotion.vercel.app/api/receive-link",
            },
          },
          { status: 500 },
        )
      }

      // Parse della risposta di n8n
      let n8nResult
      try {
        const responseText = await n8nResponse.text()
        console.log("n8n Raw Response:", responseText)

        if (!responseText.trim()) {
          console.log("Empty response from n8n, assuming success")
          n8nResult = { success: true, message: "Request received by n8n" }
        } else {
          n8nResult = JSON.parse(responseText)
        }
      } catch (jsonError) {
        console.error("Error parsing n8n JSON response:", jsonError)
        // Se n8n non restituisce JSON, assumiamo che abbia ricevuto la richiesta
        n8nResult = { success: true, message: "Request sent to n8n successfully" }
      }

      console.log("n8n workflow triggered successfully:", n8nResult)

      // Ora inizia il polling per aspettare il video URL da n8n (step 2)
      console.log("Starting to poll for video result from n8n...")
      const videoUrl = await pollForVideoResult(sessionId)

      if (!videoUrl) {
        return Response.json(
          {
            success: false,
            error: "Video generation timed out. n8n may still be processing - please try again in a few minutes.",
            sessionId: sessionId,
            debug: {
              message: "No video URL received from n8n within timeout period",
              callbackUrl: "https://v0-inkmotion.vercel.app/api/receive-link",
            },
          },
          { status: 408 },
        )
      }

      console.log("Video generation completed successfully! URL received from n8n:", videoUrl)

      return Response.json({
        success: true,
        videoUrl: videoUrl,
        message: "Video generated successfully by n8n!",
        sessionId: sessionId,
        metadata: {
          duration: "Unknown",
          resolution: "HD",
          format: "mp4",
          generatedAt: new Date().toISOString(),
          mode: "production",
          processedBy: "n8n",
        },
      })
    } catch (fetchError) {
      console.error("Network error calling n8n webhook:", fetchError)

      let errorMessage = "Network error connecting to n8n video generation service"

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          errorMessage = "Request to n8n webhook timed out (30s). Please try again."
        } else if (fetchError.message.includes("fetch")) {
          errorMessage = "Unable to connect to n8n webhook. Please check the URL and network connectivity."
        } else {
          errorMessage = fetchError.message
        }
      }

      return Response.json(
        {
          success: false,
          error: errorMessage,
          sessionId: sessionId,
          debug: {
            errorType: fetchError instanceof Error ? fetchError.name : "Unknown",
            webhookUrl: n8nWebhookUrl,
            callbackUrl: "https://v0-inkmotion.vercel.app/api/receive-link",
          },
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Video generation error:", error)

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate video",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Function to poll for video result using session ID
async function pollForVideoResult(sessionId: string): Promise<string | null> {
  const maxAttempts = 120 // Poll for up to 10 minutes (120 attempts * 5 seconds)
  const pollInterval = 5000 // 5 seconds

  console.log(
    `Starting polling for session ${sessionId} - will check every ${pollInterval}ms for up to ${maxAttempts} attempts`,
  )

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`[${sessionId}] Polling attempt ${attempt + 1}/${maxAttempts} - waiting for n8n to send video URL...`)

      // Check if we have a result for this session (sent by n8n to /api/receive-link)
      const result = videoResults.get(sessionId)
      if (result) {
        console.log(`[${sessionId}] ✅ Video URL received from n8n:`, result.videoUrl)
        videoResults.delete(sessionId) // Clean up
        return result.videoUrl
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval))
    } catch (error) {
      console.error(`[${sessionId}] Polling attempt ${attempt + 1} failed:`, error)
      await new Promise((resolve) => setTimeout(resolve, pollInterval))
    }
  }

  console.error(`[${sessionId}] ❌ Polling timed out - no video URL received from n8n`)
  return null
}

// Export the videoResults map so it can be accessed by the receive-link endpoint
export { videoResults }
