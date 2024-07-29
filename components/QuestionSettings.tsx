import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

//interface QuestionSettingsProps {
//  setDifficulty: (value: string) => void;
//  setQuestionType: (value: string) => void;
//  setTechnique: (value: string) => void;
//}

interface QuestionSettingsProps {
  onSettingsChange: (settings: QuestionSettings) => void;
}

interface QuestionSettings {
  difficulty: string;
  questionType: string;
  technique: string;
  customPrompt: string;
  isCustom: boolean;

}

export default function QuestionSettings({ onSettingsChange }: QuestionSettingsProps) {
  const [settings, setSettings] = useState<QuestionSettings>({
    difficulty: '',
    questionType: '',
    technique: '',
    customPrompt: '',
    isCustom: false,
  });


  const techniques = [
    "Array/String", "Two Pointers", "Sliding Window", "Prefix Sum", "Hash Map/Set",
    "Stack", "Queue", "Linked List", "Binary Tree DFS", "Binary Tree BFS",
    "Binary Search", "Graphs DFS", "Graphs BFS", "Heap / Priority Queue",
    "Backtracking", "DP 1D", "DP Multidimensional", "Bit Manipulation",
    "Trie", "Intervals", "Monotonic Stack"
  ];

  const handleSettingChange = (key: keyof QuestionSettings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleTabChange = (value: string) => {
    const isCustom = value === 'custom';
    const newSettings = { ...settings, isCustom };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  }

  return (
    <Card className='col-span-1 row-span-1 overflow-auto'>
        <Tabs defaultValue='dropdowns' className='w-[200px' onValueChange={handleTabChange}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Question Settings</CardTitle>
            <TabsList>
              <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="space-y-4">
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
        </CardContent>
      </Tabs>
    </Card>
  );
}