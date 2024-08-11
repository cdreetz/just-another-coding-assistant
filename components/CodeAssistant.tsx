'use cl'
import React, { useState } from 'react';
import { useChat, Message } from 'ai/react';
import ChatSection from './ChatSection';
import CodeEditor from './CodeEditor';
import CombinedQuestionComponent from './CombinedQuestionComponent'

const CodePracticeUI = () => {
  const [code, setCode] = useState('class Solution(object): \n // Write your code here');

  const initialMessages: Message[] = [
    {"id": "1", "role": "system", "content": `You are a helpful assistant who is here to help a user learn Leetcode style coding problems. If users are having trouble they can ask you for help, but do not give them the full solution unless explicitly asked for. Merely help them so they can learn better.
    Do not assume they want you to give them the answer.  If they ask for you to review the code, just tell them whether it is good or not. Then you can ask if they want help.
    NEVER assume they want you to give them the answer. ONLY address exactly what they said, do not get ahead of yourself.  If you have more to say, ask first if the user wants to hear your input.`},
  ];

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    initialMessages
  });

  const handleQuestionGenerated = (newQuestion: string) => {
    // You can perform any additional actions here when a new question is generated
    console.log("New question generated:", newQuestion);
  };

  const generateQuestion = async (prompt: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt
    };
    await handleSubmit(new Event('submit') as any, { options: { body: { messages: [...messages, userMessage] } } });
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage = {
      id: String(messages.length + 1),
      role: 'user',
      content: `${input}\n\nCurrent Code:\n${code}\n\n${input}`
    };
    handleSubmit(e, { options: { body: { messages: [...messages, userMessage] } } });
  }

  const sendCodeToAI = () => {
    const userMessage = `Can you review my current code?\n\nCurrent Code:\n${code}`
    handleSubmit(new Event('submit') as any, { options: { body: { messages: [...messages, { role: 'user', content: userMessage }] } } });
  };

  return (
    <div className="h-screen p-4 py-8 pt-16 grid grid-cols-2 grid-rows-[2fr_3fr] gap-1">
      <CombinedQuestionComponent />

      <ChatSection
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        sendMessage={sendMessage}
      />

      <CodeEditor
        code={code}
        setCode={setCode}
        sendCodeToAI={sendCodeToAI}
      />
    </div>
  );
};

export default CodePracticeUI;