import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface QuestionDisplayProps {
  question: string;
  onGenerateClick: () => void;
  isGenerating: boolean;
  isQuestionGenerated: boolean;
}

type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  inline?: boolean;
}


export default function QuestionDisplay({ 
  question, 
  onGenerateClick, 
  isGenerating, 
  isQuestionGenerated 
}: QuestionDisplayProps) {
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
  };

  return (
    <Card className='col-span-1 row-span-1 overflow-auto'>
      <CardHeader>
        <CardTitle>Question</CardTitle>
      </CardHeader>
      <CardContent>
        {isQuestionGenerated ? (
          <div className="markdown-body">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {question}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Button 
              onClick={onGenerateClick}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Question"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}