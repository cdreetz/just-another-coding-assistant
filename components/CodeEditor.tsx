import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  sendCodeToAI: () => void;
}

export default function CodeEditor({ code, setCode, sendCodeToAI }: CodeEditorProps) {
  return (
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
  );
}