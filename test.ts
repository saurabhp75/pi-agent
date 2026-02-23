import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});

console.log(text)