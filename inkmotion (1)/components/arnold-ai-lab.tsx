"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  X,
  Send,
  Brain,
  FileText,
  Map,
  HelpCircle,
  Hash,
  Target,
  ArrowLeft,
  Copy,
  Check,
  Edit3,
  Save,
  Sparkles,
  Star,
  Code,
  Clipboard,
  Bot,
  User,
} from "lucide-react"

interface ArnoldAILabProps {
  initialText: string
  isBookCoverMode: boolean
  onClose: () => void
}

type TabType = "article" | "concept-map" | "quiz"
type ChatMode = "normal" | "marketing"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  codeBlocks?: Array<{
    language: string
    code: string
  }>
  actions?: Array<{
    label: string
    action: () => void
  }>
}

interface KeyTerm {
  term: string
  explanation: string
  positions: number[]
}

export function ArnoldAILab({ initialText, isBookCoverMode, onClose }: ArnoldAILabProps) {
  const [activeTab, setActiveTab] = useState<TabType>("article")
  const [chatMode, setChatMode] = useState<ChatMode>("normal")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: `Hello! I'm Arnold, your AI literary analysis assistant. I've received your ${
        isBookCoverMode ? "book cover analysis" : "text content"
      } and I'm ready to help you explore it in depth.\n\nYou can:\n• Ask me to **summarize** the content\n• Request **keywords** extraction\n• Generate a **concept map**\n• Create a **quiz**\n• Switch to **marketing mode** for branding insights\n\nWhat would you like to explore first?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [articleContent, setArticleContent] = useState(initialText)
  const [conceptMap, setConceptMap] = useState("")
  const [quiz, setQuiz] = useState("")
  const [keyTerms, setKeyTerms] = useState<KeyTerm[]>([])
  const [highlightedTerm, setHighlightedTerm] = useState<string | null>(null)
  const [copiedAction, setCopiedAction] = useState<string | null>(null)
  const [isEditingArticle, setIsEditingArticle] = useState(false)
  const [editableContent, setEditableContent] = useState(initialText)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isEditingArticle && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [isEditingArticle])

  const handleSaveEdit = () => {
    setArticleContent(editableContent)
    setIsEditingArticle(false)
    addMessage("Article content updated successfully! ✨", "ai")
  }

  const handleCancelEdit = () => {
    setEditableContent(articleContent)
    setIsEditingArticle(false)
  }

  const addMessage = (
    content: string,
    type: "user" | "ai",
    codeBlocks?: Array<{ language: string; code: string }>,
    actions?: Array<{ label: string; action: () => void }>,
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      codeBlocks,
      actions,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const extractSuggestedContent = (messageContent: string): string => {
    // Pattern più sofisticati per estrarre contenuto suggerito
    const patterns = [
      // Testo tra virgolette doppie
      /"([^"]+)"/g,
      // Testo dopo "Ecco" o "Here's"
      /(?:Ecco|Here's)\s+(?:una|an?|the)?\s*(?:versione|version)?\s*(?:migliorata|improved)?:?\s*(.+?)(?:\n\n|$)/is,
      // Testo dopo "Suggerimento:" o "Suggestion:"
      /(?:Suggerimento|Suggestion):\s*(.+?)(?:\n\n|$)/is,
      // Testo dopo "Titolo:" o "Title:"
      /(?:Titolo|Title):\s*(.+?)(?:\n|$)/i,
      // Testo dopo "Paragrafo:" o "Paragraph:"
      /(?:Paragrafo|Paragraph):\s*(.+?)(?:\n\n|$)/is,
    ]

    for (const pattern of patterns) {
      const matches = messageContent.match(pattern)
      if (matches) {
        if (pattern.global) {
          return matches.map((match) => match.replace(/"/g, "")).join("\n\n")
        } else {
          return matches[1]?.trim() || ""
        }
      }
    }

    return ""
  }

  const handleGeneralChat = async (userInput: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat-with-arnold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          context: `You are Arnold, an AI literary analysis assistant. The user is working with this content: "${articleContent.substring(0, 500)}...". 
        You can help with general questions, content analysis, writing suggestions, and more. 
        When providing text suggestions or improvements, format them clearly so they can be applied to the canvas.`,
          chatHistory: messages.slice(-5),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Controlla se la risposta suggerisce modifiche al testo
      const shouldSuggestTransfer =
        data.content.toLowerCase().includes("modif") ||
        data.content.toLowerCase().includes("edit") ||
        data.content.toLowerCase().includes("change") ||
        data.content.toLowerCase().includes("improve") ||
        data.content.toLowerCase().includes("rewrite") ||
        data.content.toLowerCase().includes("sugger") ||
        data.content.toLowerCase().includes("titolo") ||
        data.content.toLowerCase().includes("paragrafo")

      const actions = shouldSuggestTransfer
        ? [
            {
              label: "Apply to Canvas",
              action: () => {
                // Estrai il contenuto suggerito dal messaggio
                const messageContent = data.content

                // Cerca pattern di testo suggerito (tra virgolette, dopo ":", etc.)
                let suggestedText = ""

                // Pattern per testo tra virgolette
                const quotedTextMatch = messageContent.match(/"([^"]+)"/g)
                if (quotedTextMatch) {
                  suggestedText = quotedTextMatch.map((match) => match.replace(/"/g, "")).join("\n\n")
                }

                // Pattern per testo dopo "Titolo:" o "Title:"
                const titleMatch = messageContent.match(/(?:Titolo|Title):\s*(.+?)(?:\n|$)/i)
                if (titleMatch) {
                  suggestedText = titleMatch[1].trim()
                }

                // Pattern per testo dopo "Versione migliorata:" o "Improved version:"
                const improvedMatch = messageContent.match(
                  /(?:Versione migliorata|Improved version):\s*(.+?)(?:\n\n|$)/is,
                )
                if (improvedMatch) {
                  suggestedText = improvedMatch[1].trim()
                }

                // Se non trova pattern specifici, usa tutto il contenuto del messaggio
                if (!suggestedText) {
                  // Rimuovi markdown e formattazione
                  suggestedText = messageContent
                    .replace(/\*\*/g, "")
                    .replace(/\*/g, "")
                    .replace(/`/g, "")
                    .replace(/#{1,6}\s/g, "")
                    .trim()
                }

                // Applica il testo suggerito al canvas
                if (suggestedText) {
                  // Se il testo è breve (probabilmente un titolo), sostituisci la prima riga
                  if (suggestedText.length < 100 && !suggestedText.includes("\n")) {
                    const lines = articleContent.split("\n")
                    lines[0] = suggestedText
                    const newContent = lines.join("\n")
                    setArticleContent(newContent)
                    setEditableContent(newContent)
                  } else {
                    // Se è un testo più lungo, sostituisci tutto il contenuto
                    setArticleContent(suggestedText)
                    setEditableContent(suggestedText)
                  }

                  addMessage("✨ Suggerimenti applicati al canvas con successo!", "ai")
                } else {
                  addMessage(
                    "Non sono riuscito a identificare il testo specifico da applicare. Puoi copiare manualmente il contenuto suggerito.",
                    "ai",
                  )
                }
              },
            },
            {
              label: "Edit Article",
              action: () => {
                setIsEditingArticle(true)
                setEditableContent(articleContent)
                addMessage(
                  "Article editor opened! You can now make the suggested changes directly in the canvas.",
                  "ai",
                )
              },
            },
          ]
        : undefined

      addMessage(data.content, "ai", undefined, actions)
    } catch (error) {
      console.error("Error calling chat API:", error)
      addMessage("Mi dispiace, c'è stato un errore nel processare la tua richiesta. Riprova tra poco.", "ai")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSummarize = async () => {
    setIsLoading(true)
    addMessage("/summarize", "user")

    try {
      const response = await fetch("/api/chat-with-arnold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Please provide a comprehensive summary of this article content: "${articleContent}"`,
          context: `You are Arnold, an AI literary analysis assistant. Analyze the provided article content and create a detailed summary. Focus on main themes, key points, writing style, and tone. Format your response with clear sections using markdown.`,
          chatHistory: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      addMessage(data.content, "ai", undefined, [
        {
          label: "Insert into Article",
          action: () => {
            setArticleContent((prev) => `${data.content}\n\n---\n\n${prev}`)
            setEditableContent((prev) => `${data.content}\n\n---\n\n${prev}`)
            addMessage("Summary inserted into article!", "ai")
          },
        },
        {
          label: "Copy Summary",
          action: () => {
            navigator.clipboard.writeText(data.content)
            setCopiedAction("summary")
            setTimeout(() => setCopiedAction(null), 2000)
          },
        },
      ])
    } catch (error) {
      console.error("Error generating summary:", error)
      addMessage("Sorry, there was an error generating the summary. Please try again.", "ai")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeywords = async () => {
    setIsLoading(true)
    addMessage("/keywords", "user")

    try {
      const response = await fetch("/api/chat-with-arnold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Extract and explain the key terms and concepts from this article: "${articleContent}"`,
          context: `You are Arnold, an AI literary analysis assistant. Analyze the article and identify the most important terms, concepts, and themes. For each key term, provide a brief explanation. Format as a list with bullet points.`,
          chatHistory: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      // Extract terms for highlighting (simplified approach)
      const terms =
        data.content.match(/•\s*\*\*(.*?)\*\*/g)?.map((match) => ({
          term: match.replace(/•\s*\*\*(.*?)\*\*.*/, "$1").toLowerCase(),
          explanation: "Click for details",
          positions: [0],
        })) || []

      setKeyTerms(terms)

      addMessage(data.content, "ai", undefined, [
        {
          label: "Highlight in Text",
          action: () => {
            addMessage("Key terms are now highlighted in the article. Click any highlighted term for details!", "ai")
          },
        },
      ])
    } catch (error) {
      console.error("Error extracting keywords:", error)
      addMessage("Sorry, there was an error extracting keywords. Please try again.", "ai")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConceptMap = async () => {
    setIsLoading(true)
    addMessage("/map", "user")

    try {
      const response = await fetch("/api/chat-with-arnold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Create a concept map for this article content: "${articleContent}"`,
          context: `You are Arnold, an AI literary analysis assistant. Create a visual concept map showing the relationships between main themes, concepts, and ideas in the article. Use ASCII art with boxes and arrows to show connections. Include key relationships at the end.`,
          chatHistory: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      setConceptMap(data.content)
      setActiveTab("concept-map")
      addMessage("Concept map generated! Check the 'Concept Map' tab to view the visual representation.", "ai")
    } catch (error) {
      console.error("Error generating concept map:", error)
      addMessage("Sorry, there was an error generating the concept map. Please try again.", "ai")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuiz = async () => {
    setIsLoading(true)
    addMessage("/quiz", "user")

    try {
      const response = await fetch("/api/chat-with-arnold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Create a comprehension quiz based on this article: "${articleContent}"`,
          context: `You are Arnold, an AI literary analysis assistant. Create a 5-question multiple choice quiz to test understanding of the article content. Include questions about main themes, key points, writing style, and specific details. Mark correct answers with ✓.`,
          chatHistory: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      setQuiz(data.content)
      setActiveTab("quiz")
      addMessage("Quiz generated! Check the 'Quiz' tab to test your understanding.", "ai")
    } catch (error) {
      console.error("Error generating quiz:", error)
      addMessage("Sorry, there was an error generating the quiz. Please try again.", "ai")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarketingIdeas = async () => {
    setIsLoading(true)
    addMessage("/marketing ideas", "user")

    try {
      const response = await fetch("/api/chat-with-arnold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Generate monetization and marketing strategies for this content: "${articleContent}"`,
          context: `You are Arnold, an AI marketing assistant. Based on the article content, suggest specific monetization strategies, business opportunities, and marketing approaches. Consider the content's themes, target audience, and potential value propositions.`,
          chatHistory: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      addMessage(data.content, "ai", undefined, [
        {
          label: "Develop Business Plan",
          action: () => addMessage("I can help you develop a detailed business plan for any of these ideas!", "ai"),
        },
      ])
    } catch (error) {
      console.error("Error generating marketing ideas:", error)
      addMessage("Sorry, there was an error generating marketing ideas. Please try again.", "ai")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialMedia = async (platform: string) => {
    setIsLoading(true)
    addMessage(`/marketing social ${platform}`, "user")

    try {
      const response = await fetch("/api/chat-with-arnold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Create ${platform} social media posts based on this article: "${articleContent}"`,
          context: `You are Arnold, an AI marketing assistant. Create engaging social media posts for ${platform} based on the article content. Include relevant hashtags, engaging captions, and platform-specific formatting. Generate 2-3 different post options.`,
          chatHistory: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      addMessage(data.content, "ai", undefined, [
        {
          label: "Copy All Posts",
          action: () => {
            navigator.clipboard.writeText(data.content)
            setCopiedAction("social")
            setTimeout(() => setCopiedAction(null), 2000)
          },
        },
      ])
    } catch (error) {
      console.error("Error generating social media content:", error)
      addMessage("Sorry, there was an error generating social media content. Please try again.", "ai")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAudienceAnalysis = async () => {
    setIsLoading(true)
    addMessage("/marketing audience", "user")

    try {
      const response = await fetch("/api/chat-with-arnold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Analyze the target audience for this article content: "${articleContent}"`,
          context: `You are Arnold, an AI marketing assistant. Based on the article content, identify and analyze the target audience. Include demographics, interests, pain points, preferred platforms, and spending power. Provide engagement strategies specific to this content.`,
          chatHistory: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")
      const data = await response.json()

      addMessage(data.content, "ai", undefined, [
        {
          label: "Create Persona Profiles",
          action: () => addMessage("I can create detailed persona profiles for each audience segment!", "ai"),
        },
      ])
    } catch (error) {
      console.error("Error analyzing audience:", error)
      addMessage("Sorry, there was an error analyzing the audience. Please try again.", "ai")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeExample = () => {
    setIsLoading(true)
    addMessage("Can you show me a code example for analyzing text?", "user")

    setTimeout(() => {
      addMessage(
        "Here's a simple Python example for basic text analysis:",
        "ai",
        [
          {
            language: "python",
            code: `import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter

def analyze_text(text):
    # Tokenize the text
    tokens = word_tokenize(text.lower())
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word.isalnum() and word not in stop_words]
    
    # Count word frequencies
    word_freq = Counter(filtered_tokens)
    
    # Get the most common words
    common_words = word_freq.most_common(10)
    
    # Calculate basic statistics
    total_words = len(filtered_tokens)
    unique_words = len(set(filtered_tokens))
    lexical_diversity = unique_words / total_words if total_words > 0 else 0
    
    return {
        "total_words": total_words,
        "unique_words": unique_words,
        "lexical_diversity": lexical_diversity,
        "most_common_words": common_words
    }

# Example usage
sample_text = """
Literature is the art of discovering something extraordinary about ordinary people, 
and saying with ordinary words something extraordinary.
"""

results = analyze_text(sample_text)
print(f"Total words: {results['total_words']}")
print(f"Unique words: {results['unique_words']}")
print(f"Lexical diversity: {results['lexical_diversity']:.2f}")
print("Most common words:")
for word, count in results['most_common_words']:
    print(f"  {word}: {count}")`,
          },
        ],
        [
          {
            label: "Explain Code",
            action: () =>
              addMessage(
                "This code uses the Natural Language Toolkit (NLTK) to analyze text. It tokenizes the text into words, removes common stopwords, counts word frequencies, and calculates metrics like lexical diversity (the ratio of unique words to total words). The `analyze_text` function returns a dictionary with statistics about the text.",
                "ai",
              ),
          },
        ],
      )
      setIsLoading(false)
    }, 2000)
  }

  const handleJavaScriptExample = () => {
    setIsLoading(true)
    addMessage("Show me how to analyze text with JavaScript", "user")

    setTimeout(() => {
      addMessage(
        "Here's a JavaScript example for text analysis:",
        "ai",
        [
          {
            language: "javascript",
            code: `/**
 * Simple text analyzer in JavaScript
 */
function analyzeText(text) {
  // Convert to lowercase and split into words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  // Common English stopwords
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 
    'to', 'by', 'in', 'of', 'is', 'it', 'be', 'as', 'was', 'were'
  ]);
  
  // Filter out stopwords
  const filteredWords = words.filter(word => !stopwords.has(word));
  
  // Count word frequencies
  const wordFrequency = {};
  filteredWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Sort by frequency
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Calculate statistics
  const totalWords = filteredWords.length;
  const uniqueWords = new Set(filteredWords).size;
  const lexicalDiversity = uniqueWords / totalWords;
  
  return {
    totalWords,
    uniqueWords,
    lexicalDiversity,
    mostCommonWords: sortedWords
  };
}

// Example usage
const sampleText = \`
Literature is the art of discovering something extraordinary about ordinary people, 
and saying with ordinary words something extraordinary.
\`;

const results = analyzeText(sampleText);
console.log(\`Total words: \${results.totalWords}\`);
console.log(\`Unique words: \${results.uniqueWords}\`);
console.log(\`Lexical diversity: \${results.lexicalDiversity.toFixed(2)}\`);
console.log('Most common words:');
results.mostCommonWords.forEach(([word, count]) => {
  console.log(\`  \${word}: \${count}\`);
});`,
          },
        ],
        [
          {
            label: "Run in Browser",
            action: () =>
              addMessage(
                "To run this code, you can copy it to your browser's console or use a JavaScript environment like Node.js. It will analyze the sample text and output statistics about word frequency and lexical diversity.",
                "ai",
              ),
          },
        ],
      )
      setIsLoading(false)
    }, 2000)
  }

  const handleMarketingMode = () => {
    setChatMode("marketing")
    addMessage(
      "Switched to marketing mode. Ask me about monetization, marketing strategies, and audience analysis!",
      "ai",
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const input = inputValue.trim()
    setInputValue("")
    addMessage(input, "user")

    // Handle commands
    if (input.startsWith("/")) {
      const command = input.toLowerCase()

      if (command === "/summarize") {
        handleSummarize()
      } else if (command === "/keywords") {
        handleKeywords()
      } else if (command === "/map") {
        handleConceptMap()
      } else if (command === "/quiz") {
        handleQuiz()
      } else if (command === "/marketing") {
        handleMarketingMode()
      } else if (command === "/marketing ideas") {
        handleMarketingIdeas()
      } else if (command.startsWith("/marketing social")) {
        const platform = command.split(" ")[2] || "linkedin"
        handleSocialMedia(platform)
      } else if (command === "/marketing audience") {
        handleAudienceAnalysis()
      } else if (command === "/code") {
        handleCodeExample()
      } else if (command === "/javascript") {
        handleJavaScriptExample()
      } else if (command === "/exit" || command === "/chat") {
        setChatMode("normal")
        addMessage("Returned to normal chat mode. How can I help you analyze your content?", "ai")
      } else {
        addMessage("Command not recognized. Try /summarize, /keywords, /map, /quiz, or /marketing", "ai")
      }
    } else {
      // Conversazione generale con ChatGPT 4o mini
      await handleGeneralChat(input)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "article":
        return (
          <div className="relative">
            {/* Edit Controls */}
            <div className="absolute top-0 right-0 z-10 flex space-x-3">
              {isEditingArticle ? (
                <>
                  <Button
                    onClick={handleSaveEdit}
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-xl shadow-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setIsEditingArticle(true)
                    setEditableContent(articleContent)
                  }}
                  size="sm"
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-white rounded-xl transition-all duration-200 font-medium"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="pt-16">
              {isEditingArticle ? (
                <Textarea
                  ref={textareaRef}
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className="w-full min-h-[500px] bg-gray-900 border-gray-700 text-gray-100 leading-relaxed resize-none focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-20 rounded-xl text-[15px] transition-all duration-200"
                  placeholder="Edit your content here..."
                />
              ) : (
                <div className="whitespace-pre-wrap text-gray-100 leading-relaxed text-[15px] p-6 bg-gradient-to-br from-gray-900/80 to-black/60 rounded-xl border border-gray-700 shadow-lg backdrop-blur-sm">
                  {keyTerms.length > 0
                    ? articleContent
                        .split(" ")
                        .map((word, index) => {
                          const cleanWord = word.replace(/[.,!?;:]/g, "").toLowerCase()
                          const term = keyTerms.find((t) => t.term.toLowerCase() === cleanWord)
                          if (term) {
                            return (
                              <span
                                key={index}
                                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-2 py-1 rounded-lg cursor-pointer hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 border border-purple-500 border-opacity-30 hover:border-opacity-50 font-medium"
                                onClick={() => {
                                  setHighlightedTerm(term.term)
                                  addMessage(`**${term.term}**: ${term.explanation}`, "ai")
                                }}
                              >
                                {word}
                              </span>
                            )
                          }
                          return word + " "
                        })
                        .reduce((acc, curr, index) => {
                          if (index === 0) return [curr]
                          return [...acc, " ", curr]
                        }, [] as React.ReactNode[])
                    : articleContent}
                </div>
              )}
            </div>
          </div>
        )
      case "concept-map":
        return (
          <div className="text-gray-100 relative">
            {conceptMap ? (
              <div className="relative z-10">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-700 shadow-lg">
                  {conceptMap}
                </pre>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 relative z-10">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Map className="w-16 h-16 mx-auto mb-4 opacity-60" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg font-medium text-gray-200 mb-2 mt-4">No concept map generated yet</p>
                <p className="text-sm">Use the /map command in chat to generate one</p>
              </div>
            )}
          </div>
        )
      case "quiz":
        return (
          <div className="text-gray-100 relative">
            {quiz ? (
              <div className="relative z-10">
                <div className="whitespace-pre-wrap leading-relaxed bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-700 shadow-lg">
                  {quiz}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 relative z-10">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-60" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Star className="w-6 h-6 text-green-400 animate-spin" style={{ animationDuration: "3s" }} />
                  </div>
                </div>
                <p className="text-lg font-medium text-gray-200 mb-2 mt-4">No quiz generated yet</p>
                <p className="text-sm">Use the /quiz command in chat to generate one</p>
              </div>
            )}
          </div>
        )
    }
  }

  const quickActions = [
    { label: "Summarize", action: handleSummarize, icon: FileText, gradient: "from-blue-500 to-purple-500" },
    { label: "Keywords", action: handleKeywords, icon: Hash, gradient: "from-purple-500 to-pink-500" },
    { label: "Concept Map", action: handleConceptMap, icon: Map, gradient: "from-pink-500 to-rose-500" },
    { label: "Quiz", action: handleQuiz, icon: HelpCircle, gradient: "from-rose-500 to-orange-500" },
    { label: "Marketing", action: handleMarketingMode, icon: Target, gradient: "from-orange-500 to-amber-500" },
  ]

  const renderCodeBlock = (language: string, code: string, index: number) => {
    return (
      <div className="mt-4 mb-4 rounded-xl overflow-hidden bg-black border border-gray-700 shadow-xl" key={index}>
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="flex items-center space-x-2 ml-4">
              <Code className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">{language}</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-all duration-200"
            onClick={() => {
              navigator.clipboard.writeText(code)
              setCopiedCode(`${index}`)
              setTimeout(() => setCopiedCode(null), 2000)
            }}
          >
            {copiedCode === `${index}` ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Clipboard className="w-4 h-4" />
            )}
            <span className="ml-2 text-xs font-medium">{copiedCode === `${index}` ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
        <pre className="p-6 overflow-x-auto text-sm text-gray-100 font-mono bg-gradient-to-br from-gray-950 to-black">
          <code>{code}</code>
        </pre>
      </div>
    )
  }

  const formatMessageContent = (content: string) => {
    // Split content by markdown patterns and format accordingly
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        )
      } else if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
        return (
          <em key={index} className="italic text-gray-200">
            {part.slice(1, -1)}
          </em>
        )
      } else if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="bg-gray-800 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">
            {part.slice(1, -1)}
          </code>
        )
      }
      return part
    })
  }

  const renderMessageContent = (message: ChatMessage) => {
    if (!message.codeBlocks || message.codeBlocks.length === 0) {
      return <div className="whitespace-pre-wrap leading-relaxed">{formatMessageContent(message.content)}</div>
    }

    return (
      <>
        <div className="whitespace-pre-wrap leading-relaxed">{formatMessageContent(message.content)}</div>
        {message.codeBlocks.map((block, index) => renderCodeBlock(block.language, block.code, index))}
      </>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-800 bg-gradient-to-r from-black to-gray-900">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Arnold AI Lab
              </h1>
              <p className="text-gray-400 text-sm font-medium">Interactive Content Analysis & Marketing Assistant</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {chatMode === "marketing" && (
            <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-xl px-4 py-2">
              <span className="text-gradient bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent text-sm font-medium flex items-center">
                <Target className="w-4 h-4 mr-2 text-orange-400" />
                Marketing Mode
              </span>
            </div>
          )}
          <Button
            onClick={onClose}
            variant="destructive"
            className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Panel - Editor */}
        <div className="w-1/2 border-r border-gray-800 flex flex-col bg-gradient-to-br from-gray-900 to-black">
          {/* Tabs */}
          <div className="flex border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
            {[
              { id: "article", label: "Article", icon: FileText, gradient: "from-blue-500 to-purple-500" },
              { id: "concept-map", label: "Concept Map", icon: Map, gradient: "from-purple-500 to-pink-500" },
              { id: "quiz", label: "Quiz", icon: HelpCircle, gradient: "from-pink-500 to-rose-500" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {activeTab === tab.id && (
                  <div
                    className={`absolute inset-0 opacity-10 bg-gradient-to-r ${tab.gradient}`}
                    style={{ zIndex: 0 }}
                  ></div>
                )}
                <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? "text-white" : ""}`} />
                <span className={`font-semibold relative z-10 ${activeTab === tab.id ? "text-white" : ""}`}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.gradient}`}
                    style={{ zIndex: 10 }}
                  ></div>
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">{renderTabContent()}</div>
        </div>

        {/* Right Panel - Chat */}
        <div className="w-1/2 flex flex-col bg-gradient-to-br from-gray-900 to-black">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative rounded-2xl p-4 shadow-lg ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-4"
                        : "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700 mr-4"
                    }`}
                  >
                    {/* Left border accent for AI messages */}
                    {message.type === "ai" && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    )}

                    <div className={message.type === "ai" ? "pl-3" : ""}>
                      {renderMessageContent(message)}
                      {message.actions && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              onClick={action.action}
                              variant="outline"
                              size="sm"
                              className="text-xs border-gray-600 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-200 rounded-lg font-medium"
                            >
                              {copiedAction === action.label.toLowerCase().split(" ")[0] ? (
                                <Check className="w-3 h-3 mr-1 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3 mr-1" />
                              )}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-4 shadow-lg relative mr-4">
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <div className="flex items-center space-x-2 pl-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <span className="text-gray-400 text-sm ml-2 font-medium">Arnold is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-t border-gray-800 bg-gradient-to-r from-gray-900 to-black">
            <div className="flex flex-wrap gap-3 mb-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  onClick={action.action}
                  variant="outline"
                  size="sm"
                  className={`text-xs border-gray-700 hover:border-transparent transition-all duration-200 rounded-xl font-medium relative overflow-hidden group`}
                  disabled={isLoading}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${action.gradient} transition-opacity duration-200`}
                    style={{ opacity: "0.1" }}
                  ></div>
                  <action.icon className="w-3 h-3 mr-2 relative z-10" />
                  <span className="relative z-10">{action.label}</span>
                </Button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <Input
                ref={chatInputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  chatMode === "marketing"
                    ? "Marketing command or general question... (try /marketing ideas)"
                    : "Ask me anything about your content, writing, or use commands like /summarize, /keywords..."
                }
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-20 rounded-xl transition-all duration-200"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 rounded-xl shadow-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
