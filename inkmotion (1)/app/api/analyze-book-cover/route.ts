export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return Response.json({ success: false, error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")

    // Call OpenAI Vision API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this book cover and extract detailed information about the book. Please provide:
                1. The book title and author (if visible)
                2. Genre and themes
                3. Detailed plot summary or story premise based on visual elements
                4. Character descriptions if any are depicted
                5. Setting and atmosphere
                6. Mood and tone
                7. Target audience
                8. Key visual elements and their symbolic meaning
                
                Format your response as a comprehensive narrative description that could be used to create a promotional video. Be creative and detailed, expanding on what the cover suggests about the story.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${image.type};base64,${base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error("OpenAI API error:", errorData)
      return Response.json(
        {
          success: false,
          error: `OpenAI API error: ${errorData.error?.message || "Unknown error"}`,
        },
        { status: 500 },
      )
    }

    const openaiResult = await openaiResponse.json()
    const extractedText = openaiResult.choices[0]?.message?.content

    if (!extractedText) {
      return Response.json(
        {
          success: false,
          error: "Failed to extract text from image",
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      extractedText: extractedText,
      message: "Book cover analyzed successfully!",
    })
  } catch (error) {
    console.error("Book cover analysis error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to analyze book cover",
      },
      { status: 500 },
    )
  }
}
