"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MessageSquare, X, Send, Bot, User, Phone } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_QUESTIONS = [
  "What are your hourly rates?",
  "Can I bring my own food?",
  "Where do the yachts depart from?",
  "How many guests are allowed?",
]

const MOCK_ANSWERS: Record<string, string> = {
  "what are your hourly rates?": "Our luxury yachts range from $300 to $800 per hour depending on the size and amenities. You can view full pricing details on our Fleet page.",
  "can i bring my own food?": "Yes, absolutely! You are welcome to bring your own food and beverages. We also offer premium catering add-ons if you prefer.",
  "where do the yachts depart from?": "All our charters depart from Burnham Harbor in downtown Chicago, right next to the Field Museum.",
  "how many guests are allowed?": "Our yachts accommodate between 6 to 13 guests maximum, per US Coast Guard regulations, depending on the specific vessel.",
}

export function AiConcierge() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg_welcome", role: "assistant", content: "Hi there! I'm the Chicago Yachts Concierge. How can I help you plan your perfect charter today?" }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen, isTyping])

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: text }
    setMessages(prev => [...prev, newUserMsg])
    setInputValue("")
    setIsTyping(true)

    // Mock OpenAI / Backend processing delay
    setTimeout(() => {
      setIsTyping(false)
      const lowercaseQuery = text.toLowerCase()
      
      // Try to find a matched answer, otherwise provide a generic fallback
      const matchedKey = Object.keys(MOCK_ANSWERS).find(key => lowercaseQuery.includes(key.replace("?", "")))
      const answerContent = matchedKey 
        ? MOCK_ANSWERS[matchedKey] 
        : "That's a great question! I'm still learning about that. Please feel free to reach out to our human concierge on WhatsApp for immediate assistance."

      const newAiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: answerContent }
      setMessages(prev => [...prev, newAiMsg])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:shadow-black/30 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Concierge"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-slate-900"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">AI Concierge</h3>
              <p className="text-[10px] text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Online
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-primary text-primary-foreground'}`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex gap-2 max-w-[85%] flex-row">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-none shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          
          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-100 hover:border-slate-300 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 resize-none overflow-hidden"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button 
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 bottom-2 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {/* WhatsApp Escalation */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center">
            <a 
              href="https://wa.me/15550123456?text=Hi! I need help booking a yacht."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Need human assistance? Chat on WhatsApp
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
