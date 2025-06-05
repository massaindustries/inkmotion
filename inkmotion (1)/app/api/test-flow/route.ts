export async function POST(request: Request) {
  try {
    const { testText = "This is a test video generation request" } = await request.json()

    console.log(" Testing complete flow...")

    // Simulate the same flow as the real generation
    const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/generate-video`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: testText,
        isBookCover: false,
        type: "test_input",
      }),
    })

    const result = await response.json()

    return Response.json({
      success: true,
      message: "Test flow completed",
      result: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test flow error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Test failed",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return Response.json({
    message: "Test flow endpoint",
    endpoints: {
      n8nWebhook: "https://massaindustries.app.n8n.cloud/webhook/short-video-text",
      receiveLink: "https://v0-inkmotion.vercel.app/api/receive-link",
      generateVideo: "/api/generate-video",
    },
    flow: [
      "1. User clicks generate video",
      "2. Platform sends text to n8n webhook",
      "3. Platform starts visual steps",
      "4. Platform polls for result",
      "5. n8n processes and sends video URL to /api/receive-link",
      "6. Platform receives URL and shows video",
    ],
  })
}
