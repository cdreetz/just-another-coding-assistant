'use client'

import CodePracticeUI from '@/components/CodeAssistant'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"

export default function Home() {
  return (
    <main className="relative">
      <div className="absolute top-2 left-4 z-10">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon">
              <QuestionMarkCircledIcon className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>How to Use This Page</AlertDialogTitle>
              <AlertDialogDescription>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Select the difficulty level, question type, and technique using the dropdowns on the left.</li>
                  <li>Alternatively, switch to the "Custom" tab to enter your own prompt for a coding question.</li>
                  <li>Click the "Generate Question" button to create a new coding problem based on your selections.</li>
                  <li>The generated question will appear on the right side of the screen.</li>
                  <li>Use the code editor below to work on your solution.</li>
                  <li>You can ask for help or submit your code for review using the chat interface.</li>
                </ol>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <CodePracticeUI />
    </main>
  )
}