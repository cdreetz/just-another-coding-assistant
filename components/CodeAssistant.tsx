'use client'

import React, { useState, useEffect } from 'react';
import { useChat, Message } from 'ai/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

const CodePracticeUI = () => {
  const [difficulty, setDifficulty] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [question, setQuestion] = useState('');
  const [code, setCode] = useState('class Solution(object): \n // Write your code here');

  const initialMessages: Message[] = [
    {"id": "1", "role": "user", "content": "You are a helpful assistant who is here to help a user learn Leetcode style coding problems. If users are having trouble they can ask you for help, but do not give them the full solution unless explicitly asked for. Merely help them so they can learn better."},
    {"id": "2", "role": "assistant", "content": "Problem: Two Sum\n\nDescription: Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order."}
  ];

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    initialMessages
  });

  useEffect(() => {
    setQuestion(messages[1].content);
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: Message = {
      id: '3',
      role: 'user',
      content: `${input}\n\nCurrent Code:\n${code}`
    };
    handleSubmit(e, { options: { body: { messages: [...messages, userMessage] } } });
  }


  const sendCodeToAI = () => {
    const userMessage = `Can you review my current code?\n\nCurrent Code:\n${code}`
    handleSubmit(new Event('submit'), { options: { body: { messages: [...messages, { role: 'user', content: userMessage }] } } });
  };

  return (
    <div className="h-screen p-4 grid grid-cols-2 grid-rows-[1fr_3fr] gap-1">
      {/* Question Settings Card */}
      <Card className='col-span-1 row-span-1 overflow-auto'>
        <CardHeader>
          <CardTitle>Question Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={(value) => setDifficulty(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setQuestionType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="algorithm">Algorithm</SelectItem>
              <SelectItem value="dataStructure">Data Structure</SelectItem>
              <SelectItem value="systemDesign">System Design</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Question Display Card */}
      <Card className='col-span-1 row-span-1 overflow-auto'>
        <CardHeader>
          <CardTitle>Question</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{question}</p>
        </CardContent>
      </Card>

      {/* Chat Section Card */}
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

      {/* Code Editor Card */}
      <Card className='col-span-1 row-span-1 flex flex-col'>
        <CardHeader>
          <CardTitle>Your Code</CardTitle>
        </CardHeader>
        <CardContent className='flex-grow flex flex-col'>
          <div className="flex-grow border rounded overflow-hidden mb-4">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => highlight(code, languages.python, 'python')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                height: '100%',
              }}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setCode(code)} variant="outline">Save Code</Button>
            <Button onClick={sendCodeToAI} variant="outline">Send Code to AI</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodePracticeUI;