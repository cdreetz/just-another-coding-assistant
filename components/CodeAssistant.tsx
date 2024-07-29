'use client'

import React, { useState, useEffect } from 'react';
import { getAnswer } from '../app/actions'
import { useChat, Message } from 'ai/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Editor from 'react-simple-code-editor';
import QuestionDisplay from './QuestionDisplay';
import QuestionSettings from './QuestionSettings';
import ChatSection from './ChatSection';
import CodeEditor from './CodeEditor';

interface QuestionSettings {
  difficulty: string;
  questionType: string;
  technique: string;
  customPrompt: string;
  isCustom: boolean;
}

const CodePracticeUI = () => {
  const [question, setQuestion] = useState('');
  const [code, setCode] = useState('class Solution(object): \n // Write your code here');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isQuestionGenerated, setIsQuestionGenerated] = useState<boolean>(false);
  const [questionSettings, setQuestionSettings] = useState<QuestionSettings>({
    difficulty: '',
    questionType: '',
    technique: '',
    customPrompt: '',
    isCustom: false,
  });

  const initialMessages: Message[] = [
    {"id": "1", "role": "user", "content": "You are a helpful assistant who is here to help a user learn Leetcode style coding problems. If users are having trouble they can ask you for help, but do not give them the full solution unless explicitly asked for. Merely help them so they can learn better."},
  ];

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    initialMessages
  });

  const createSyntheticEvent = (): React.FormEvent<HTMLFormElement> => {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    return {
      ...event,
      preventDefault: () => {},
      target: document.createElement('form'),
      currentTarget: document.createElement('form'),
    } as unknown as React.FormEvent<HTMLFormElement>;
  }


  const generateQuestion = async () => {
    console.log("Generation queston...")
    setIsGenerating(true);
    console.log("Set isGenerating to true")

    let prompt;
    if (questionSettings.isCustom) {
      prompt = questionSettings.customPrompt;
    } else {
      prompt = `Generate a Leetcode style coding problem like those from Leetcode 75. Here is the criteria:
        Difficulty: ${questionSettings.difficulty || 'Any'}
        Question Type: ${questionSettings.questionType || 'Any'}
        Technique: ${questionSettings.technique || 'Any'}`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt
    };

    try {
      const syntheticEvent = createSyntheticEvent();

      await handleSubmit(syntheticEvent, {
        options: { body: { messages: [...messages, userMessage] } }
      });
      console.log("Question generated")
    } catch (error) {
      console.error("Error generating question:", error);
    }

    setIsGenerating(false);
    console.log("Set isGereating to false")
    setIsQuestionGenerated(true);
    console.log("Set isQuestionGenerated to true")
  };

  useEffect(() => {
    if (messages.length > 1) {
      setQuestion(messages[messages.length - 1].content);
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: Message = {
      id: String(messages.length + 1),
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
      <QuestionSettings
        onSettingsChange={setQuestionSettings}
      />

      {/* Question Display Card */}
      <QuestionDisplay
        question={question}
        onGenerateClick={generateQuestion}
        isGenerating={isGenerating}
        isQuestionGenerated={isQuestionGenerated}
      />

      {/* Chat Section Card */}
      <ChatSection
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        sendMessage={sendMessage}
      />

      {/* Code Editor Card */}
      <CodeEditor
        code={code}
        setCode={setCode}
        sendCodeToAI={sendCodeToAI}
      />
    </div>
  );
};

export default CodePracticeUI;