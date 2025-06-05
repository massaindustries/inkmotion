import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, context, chatHistory } = await request.json()

    // Costruisci il contesto della conversazione
    let conversationContext = context + "\n\n"

    if (chatHistory && chatHistory.length > 0) {
      conversationContext += "Recent conversation:\n"
      chatHistory.forEach((msg: any) => {
        conversationContext += `${msg.type === "user" ? "User" : "Arnold"}: ${msg.content}\n`
      })
      conversationContext += "\n"
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are Arnold, a sophisticated AI literary analysis and marketing assistant. You help users analyze content, improve their writing, and provide insights about literature and marketing.

Key capabilities:
- Literary analysis and content critique
- Writing suggestions and improvements  
- Marketing and branding advice
- Content summarization and keyword extraction
- Concept mapping and quiz generation
- Social media content creation
- Target audience analysis

When analyzing content:
- Focus specifically on the provided text
- Provide actionable insights and suggestions
- Use clear, structured formatting with markdown
- Be specific and relevant to the actual content
- Avoid generic examples - work with the real content

When users ask about modifying, editing, or improving their text, suggest they can apply changes directly to their article canvas.

Respond in the same language the user is using (Italian if they write in Italian, English if they write in English).`,
      prompt: conversationContext + "User: " + message,
      maxTokens: 1500,
    })

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
