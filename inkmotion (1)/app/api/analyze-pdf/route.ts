import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get("pdf") as File

    if (!pdfFile) {
      return NextResponse.json({ success: false, error: "No PDF file provided" }, { status: 400 })
    }

    // Verifica che sia un PDF
    if (!pdfFile.type.includes("pdf")) {
      return NextResponse.json({ success: false, error: "File must be a PDF" }, { status: 400 })
    }

    // Verifica dimensione file (max 10MB)
    if (pdfFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be less than 10MB" }, { status: 400 })
    }

    try {
      // Leggi il file PDF come buffer
      const pdfBytes = await pdfFile.arrayBuffer()
      const buffer = Buffer.from(pdfBytes)

      // Per ora, simuliamo l'estrazione del testo dal PDF
      // In produzione, useresti una libreria come pdf-parse:
      // const pdf = require('pdf-parse');
      // const data = await pdf(buffer);
      // const extractedText = data.text;

      // Simulazione di testo estratto (sostituisci con vera estrazione)
      const extractedText = `
        Questo è il contenuto estratto dal PDF "${pdfFile.name}".
        
        Il documento contiene informazioni dettagliate su una storia avvincente che narra le avventure di un protagonista coraggioso in un mondo fantastico. La trama si sviluppa attraverso diversi capitoli, ognuno dei quali presenta sfide uniche e personaggi memorabili.
        
        I temi principali includono l'amicizia, il coraggio, la scoperta di sé e la lotta tra il bene e il male. L'ambientazione è ricca di dettagli e crea un'atmosfera coinvolgente che trasporta il lettore in un universo parallelo.
        
        I personaggi sono ben sviluppati, con personalità distinte e archi narrativi convincenti. Il protagonista evolve durante la storia, imparando lezioni importanti e crescendo come persona.
        
        Lo stile di scrittura è fluido e accessibile, rendendo la lettura piacevole per un pubblico ampio. L'autore utilizza descrizioni vivide e dialoghi naturali per dare vita alla storia.
        
        Il climax è particolarmente emozionante, con una risoluzione soddisfacente che chiude tutti i fili narrativi aperti durante la storia.
      `

      // Usa OpenAI per creare un riassunto conciso
      const { text: summary } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `
          Analizza il seguente testo estratto da un PDF e crea un riassunto conciso per la generazione di video promozionali.
          
          REQUISITI:
          - Massimo 10 righe
          - Includi: trama principale, personaggi chiave, temi, ambientazione, mood/atmosfera
          - Scrivi in modo coinvolgente per la creazione di contenuti video
          - Usa un linguaggio descrittivo e cinematografico
          
          TESTO DA ANALIZZARE:
          ${extractedText}
          
          RIASSUNTO CINEMATOGRAFICO:
        `,
        maxTokens: 500,
        temperature: 0.7,
      })

      return NextResponse.json({
        success: true,
        summary: summary.trim(),
        filename: pdfFile.name,
        fileSize: pdfFile.size,
      })
    } catch (aiError) {
      console.error("Error with OpenAI API:", aiError)
      return NextResponse.json({ success: false, error: "Failed to analyze PDF content with AI" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error processing PDF:", error)
    return NextResponse.json({ success: false, error: "Failed to process PDF file" }, { status: 500 })
  }
}
