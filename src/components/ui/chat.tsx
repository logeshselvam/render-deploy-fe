"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface MenuChatProps {
  menuId: number | null
  menuName?: string
}

export function MenuChat({ menuId, menuName }: MenuChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hi! I'm your menu assistant. I can help you find the perfect dish from ${menuName || 'our menu'}. Just ask me about what you're craving! 🍽️`,
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const sendMessage = async () => {
    if (!currentMessage.trim() || !menuId || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage("")
    setIsLoading(true)

    try {
      const response = await fetch('https://render-deploy-iib7.onrender.com/menu-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage.content,
          menuId: menuId
        })
      })

      if (!response.ok) throw new Error('Failed to get recommendation')
      
      const data = await response.json()
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.suggestion || data.message || 'I apologize, but I couldn\'t generate a recommendation at this time. Please try again!',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error getting menu suggestion:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment! 🤖',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
        disabled={!menuId}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 z-50 w-80 shadow-2xl transition-all duration-200",
      isMinimized ? "h-14" : "h-96"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer" 
                 onClick={() => setIsMinimized(!isMinimized)}>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          Menu Assistant
          {menuName && (
            <Badge variant="secondary" className="text-xs">
              {menuName}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              setIsMinimized(!isMinimized)
            }}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 items-start",
                    message.type === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {message.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[240px] text-sm",
                      message.type === 'user'
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1 opacity-70",
                      message.type === 'user' ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 items-start">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      <Bot className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2 max-w-[240px] text-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={menuId ? "Ask for menu recommendations..." : "Please select a menu first"}
                disabled={!menuId || isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || !menuId || isLoading}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!menuId && (
              <p className="text-xs text-muted-foreground mt-2">
                Select a menu from the sidebar to start getting recommendations!
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 