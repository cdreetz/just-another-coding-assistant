import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from 'ai'
import { getAnswer } from '@/app/actions';

interface CombinedQuestionProps {
  onQuestionGenerated: (question: string) => void;
  generateQuestion: (prompt: string) => Promise<void>;
  messages: Message[];
}

interface QuestionSettings {
  difficulty: string;
  questionType: string;
  technique: string;
  customPrompt: string;
  isCustom: boolean;
}

interface QuestionDisplayProps {
  question: string;
}

type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  inline?: boolean;
}



function QuestionDisplay({ question }: QuestionDisplayProps) {
    const components: Components = {
    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
    p: ({node, ...props}) => <p className="mb-2" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
    li: ({node, ...props}) => <li className="mb-1" {...props} />,
    code: ({ inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '')
      return !inline ? (
        <pre className="bg-gray-100 rounded p-2 my-2 overflow-x-auto">
          <code className={`block whitespace-pre-wrap font-mono text-sm ${className}`} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm" {...props}>
          {children}
        </code>
      )
    },
  }

  return (
    <div className='markdown-body'>
      {question ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {question}
        </ReactMarkdown>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <p>No question generated yet. Use the settings on the left</p>
        </div>
      )}
    </div>
  )
}

export default function CombinedQuestionComponent() {
  const [settings, setSettings] = useState<QuestionSettings>({
    difficulty: '',
    questionType: '',
    technique: '',
    customPrompt: '',
    isCustom: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [question, setQuestion] = useState('');

  const techniques = [
    "Array/String", "Two Pointers", "Sliding Window", "Prefix Sum", "Hash Map/Set",
    "Stack", "Queue", "Linked List", "Binary Tree DFS", "Binary Tree BFS",
    "Binary Search", "Graphs DFS", "Graphs BFS", "Heap / Priority Queue",
    "Backtracking", "DP 1D", "DP Multidimensional", "Bit Manipulation",
    "Trie", "Intervals", "Monotonic Stack"
  ];

  const handleSettingChange = (key: keyof QuestionSettings, value: string) => {
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));
  };

  const handleTabChange = (value: string) => {
    const isCustom = value === 'custom';
    setSettings(prevSettings => ({ ...prevSettings, isCustom }));
  }

  const handleGenerateQuestion = async () => {
    setIsGenerating(true);
    try {
      let prompt;
      if (settings.isCustom) {
        prompt = settings.customPrompt;
      } else {
        prompt = `Generate a Leetcode style coding problem like those from Leetcode 75. Here is the criteria:
          Difficulty: ${settings.difficulty || 'Any'}
          Question Type: ${settings.questionType || 'Any'}
          Technique: ${settings.technique || 'Any'}
          Do you not repeat what you are asked to do, just generate the problem and info.`;
      }

      const { text, finishReason, usage } = await getAnswer(prompt);
      setQuestion(text);
      console.log("Finish reason", finishReason)
      console.log("Token usage: ", usage)
      } catch (error) {
        console.error("Error generating question:", error);
      } finally {
        setIsGenerating(false);
      }
    };

//  useEffect(() => {
//    if (messages.length > 1) {
//      const newQuestion = messages[messages.length - 1].content;
//      setQuestion(newQuestion);
//      onQuestionGenerated(newQuestion);
//    }
//  }, [messages, onQuestionGenerated]);

  return (
    <Card className='col-span-2 row-span-1 overflow-auto'>
      <CardHeader>
        <CardTitle>Question Settings and Display</CardTitle>
      </CardHeader>
      <CardContent className="flex">
        <div className="w-1/2 pr-4">
          <Tabs defaultValue='dropdowns' onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="dropdowns" className='space-y-4'>
              <Select onValueChange={(value) => handleSettingChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => handleSettingChange('questionType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select question type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="algorithm">Algorithm</SelectItem>
                  <SelectItem value="dataStructure">Data Structure</SelectItem>
                  <SelectItem value="systemDesign">System Design</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => handleSettingChange('technique', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technique (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {techniques.map((technique) => (
                    <SelectItem key={technique} value={technique.toLowerCase().replace(/ /g, '-')}>
                      {technique}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
            <TabsContent value="custom">
              <Input
                placeholder='Type your custom problem request here..'
                value={settings.customPrompt}
                onChange={(e) => handleSettingChange('customPrompt', e.target.value)}
                className='h-full'
              />
            </TabsContent>
          </Tabs>
          <Button 
            onClick={handleGenerateQuestion}
            disabled={isGenerating}
            className="mt-4"
          >
            {isGenerating ? "Generating..." : "Generate Question"}
          </Button>
        </div>
        <div className="w-1/2 pl-4 border-l">
          <QuestionDisplay question={question} />
        </div>
      </CardContent>
    </Card>
  );
}