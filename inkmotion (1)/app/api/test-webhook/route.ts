export async function GET() {
  return Response.json({
    success: true,
    message: "Test endpoint is working",
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: "https://massaindustries.app.n8n.cloud/webhook/short-video-text",
      callback: "/api/receive-link",
    },
  })
}

export async function POST() {
  // URL corretto del webhook n8n
  const n8nWebhookUrl = "https://massaindustries.app.n8n.cloud/webhook/short-video-text"

  try {
    console.log("Testing n8n webhook connection...")

    const testPayload = {
      text: "This is a test message",
      sessionId: `test_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: "test-endpoint",
      isBookCover: false,
      type: "test",
      callbackUrl: "https://inkmotion.vercel.app/api/receive-link",
    }

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(testPayload),
    })

    const contentType = response.headers.get("content-type")
    let responseData: any

    try {
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        const text = await response.text()
        responseData = { rawResponse: text.substring(0, 500) }
      }
    } catch {
      responseData = { error: "Could not parse response" }
    }

    return Response.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      contentType: contentType,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      testPayload: testPayload,
    })
  } catch (error) {
    console.error("Test webhook error:", error)

    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      webhookUrl: n8nWebhookUrl,
    })
  }
}
