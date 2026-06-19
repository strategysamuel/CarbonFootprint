import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  console.log("INCOMING BODY:", JSON.stringify(body, null, 2));
  const { messages } = body;

  const normalizedMessages = messages.map((m: any) => {
    let textContent = m.content;
    if (!textContent && m.parts) {
      textContent = m.parts.map((p: any) => p.text || '').join('');
    }

    if (m.experimental_attachments && m.experimental_attachments.length > 0) {
      const parts: any[] = [{ type: 'text', text: textContent || '' }];
      for (const attachment of m.experimental_attachments) {
        parts.push({
          type: 'file',
          data: attachment.url,
          mimeType: attachment.contentType,
        });
      }
      return { role: m.role, content: parts };
    }

    return { role: m.role, content: textContent || '' };
  });

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are the CarbonMirror AI Sustainability Coach.
Your goal is to provide supportive, highly practical, and personalized advice on reducing carbon footprints.
If the user attaches a file (like an Excel, CSV, or PDF report), carefully analyze the carbon data within it. Provide a clear summary of their emissions, identify key areas for improvement, and offer actionable suggestions to reduce their carbon footprint.
Be encouraging and positive. Do not sound robotic. Use emojis appropriately.
If the user asks about something unrelated to sustainability, politely pivot back to climate action.`,
    messages: normalizedMessages,
  });

  return result.toUIMessageStreamResponse();
}
