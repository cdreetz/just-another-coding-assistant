import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Message } from 'ai/react';

interface ChatSectionProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ChatSection({ messages, input, handleInputChange, sendMessage }: ChatSectionProps) {
  return (
    <Card className='col-span-1 row-span-1 flex flex-col'>
      <CardHeader>
        <CardTitle>Chat with AI</CardTitle>
      </CardHeader>
      <CardContent className='flex-grow flex flex-col'>
        <ScrollArea className='flex-grow mb-4 border rounded'>
          <div className="p-2">
            {messages.slice(2).map((m, index) => (
              <div key={index} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
                  {m.content}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            className="flex-grow p-2 border border-gray-300 rounded"
            value={input}
            placeholder="Ask the AI..."
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  );
}