'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText, generateText } from 'ai';
// import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  return stream.value;
}

export async function getAnswer(prompt: string) {
  const { text, finishReason, usage } = await generateText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    prompt: prompt,
  });

  return { text, finishReason, usage };
}