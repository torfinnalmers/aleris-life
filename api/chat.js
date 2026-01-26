import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `Du är en hjälpsam hälsoassistent för Aleris. Du svarar på frågor om Aleris vårdtjänster på svenska.

Viktiga riktlinjer:
- Svara alltid på svenska
- Var vänlig och professionell
- Om du inte vet svaret, säg det ärligt
- Hänvisa till aleris.se för mer detaljerad information
- Ge aldrig medicinsk rådgivning - uppmana användaren att kontakta vården för medicinska frågor

Aleris erbjuder bland annat:
- Specialistvård
- Primärvård och vårdcentraler
- Tandvård
- Företagshälsovård
- Fertilitetsvård
- Psykiatri och psykologi`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Något gick fel. Försök igen.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
