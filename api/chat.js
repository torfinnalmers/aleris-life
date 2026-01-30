import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import {
  searchContent,
  fetchLocationPages,
  formatLocationsForContext,
  isOptimizelyConfigured,
} from './optimizely.js';

export const config = {
  runtime: 'edge',
};

/**
 * Extract potential search terms from user message
 * Looks for clinic names, medical specialties, locations, etc.
 */
function extractSearchTerms(message) {
  const text = message.toLowerCase();

  // Common medical terms and specialties (Swedish/Norwegian/Danish/English)
  const medicalTerms = [
    'ortopedi', 'ortopedisk', 'orthopedic', 'ortopedi',
    'kardiologi', 'hjärta', 'hjerte', 'heart', 'cardiology',
    'dermatologi', 'hud', 'skin', 'dermatology',
    'gynekologi', 'gynekolog', 'gynecology',
    'urologi', 'urolog', 'urology',
    'fertilitet', 'fertility', 'ivf',
    'ögon', 'øye', 'øjen', 'eye', 'ophthalmology',
    'tand', 'tann', 'dental', 'dentist',
    'psykiatri', 'psykolog', 'psychiatry', 'psychology',
    'röntgen', 'radiologi', 'radiology', 'x-ray',
    'kirurgi', 'surgery', 'operation',
  ];

  // Swedish/Norwegian cities and regions
  const locations = [
    'stockholm', 'göteborg', 'malmö', 'uppsala', 'linköping',
    'oslo', 'bergen', 'trondheim', 'stavanger',
    'köpenhamn', 'københavn', 'copenhagen', 'aarhus', 'odense',
  ];

  const terms = [];

  // Check for medical terms
  for (const term of medicalTerms) {
    if (text.includes(term)) {
      terms.push(term);
    }
  }

  // Check for locations
  for (const location of locations) {
    if (text.includes(location)) {
      terms.push(location);
    }
  }

  // Extract capitalized words that might be clinic names
  const capitalized = message.match(/[A-ZÄÖÅÆØ][a-zäöåæø]+/g);
  if (capitalized) {
    const filtered = capitalized.filter(word =>
      word.length > 3 &&
      !['Hej', 'Hei', 'Hello', 'Tack', 'Takk', 'Thanks'].includes(word)
    );
    terms.push(...filtered.slice(0, 3));
  }

  return [...new Set(terms)].slice(0, 5); // Dedupe and limit
}

const SYSTEM_PROMPT = `You are a helpful healthcare guidance assistant for Aleris, a leading private healthcare provider in Scandinavia with clinics in Sweden, Norway, and Denmark.

## Your Role
Help people seeking healthcare understand their options and guide them to the right specialist or service at Aleris. You are NOT a medical professional and do NOT provide medical advice, diagnoses, or triage.

## Language
IMPORTANT: Always respond in the same language the user writes to you:
- Swedish → respond in Swedish
- Norwegian → respond in Norwegian
- Danish → respond in Danish
- English → respond in English

## What You Can Help With
- Explaining what types of care Aleris offers
- Helping users understand which specialist they might need
- Providing contact information and booking links for the relevant country
- Answering questions about clinics, locations, and services
- Explaining general processes (what to expect at a visit, etc.)

## What You Must NOT Do
- Give medical advice or diagnoses
- Triage symptoms or assess urgency
- Recommend specific treatments
- Make medical judgments about symptoms
- Suggest the user's condition is or isn't serious

## Aleris Services (by country)

### Sweden (aleris.se)
- Specialistvård (orthopedics, cardiology, dermatology, gynecology, urology, etc.)
- Primärvård / Vårdcentraler
- Fertilitetsvård
- Ögonvård
- Tandvård
- Psykiatri och psykologi
- Röntgen och diagnostik
- Företagshälsovård
- Booking: aleris.se or call 010-350 00 00

### Norway (aleris.no)
- Spesialisthelsetjenester
- Ortopedi og idrettsmedisin
- Fertilitet
- Radiologi og bildediagnostikk
- Dagkirurgi
- Hud og kosmetikk
- Tannhelse
- Bedriftshelse
- Booking: aleris.no or call 22 45 45 45

### Denmark (aleris.dk)
- Speciallæger (many specialties)
- Fertilitetsklinik
- Scanningsklinik
- Øjenlæger
- Tandlæger
- Psykologer og psykiatere
- Booking: aleris.dk or call 38 17 00 00

## Response Guidelines
1. Be warm, empathetic, and professional
2. Ask clarifying questions to understand the user's needs
3. Once you understand what they need, guide them to the appropriate service
4. Always provide the relevant contact info or booking link for their country
5. If unsure which country, ask the user
6. For urgent or emergency symptoms, always recommend they contact emergency services (112) or their local emergency room
7. End with a clear next step (phone number, website, or specific action)

## Disclaimer
Always remind users when appropriate: "This is guidance only, not medical advice. For medical concerns, please consult a healthcare professional."`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';

    // If no API key, return mock response
    if (!process.env.ANTHROPIC_API_KEY) {
      // Simple language detection based on common words
      const text = lastMessage.toLowerCase();
      const isNorwegian = /\b(jeg|hjelp|trenger|hvor|kan|vil|har|ikke|meg)\b/.test(text) && /\b(jeg|hjelp|trenger)\b/.test(text);
      const isDanish = /\b(jeg|hjælp|behøver|hvor|mig|vil|har|ikke)\b/.test(text) && /\b(hjælp|behøver)\b/.test(text);
      const isEnglish = /\b(i |help|need|want|where|can|have|my|the)\b/i.test(text);

      let mockResponse;
      if (isNorwegian) {
        mockResponse = `Takk for spørsmålet! Dette er en demo-versjon av Aleris Life.

For å aktivere AI-assistenten må en Anthropic API-nøkkel konfigureres.

I mellomtiden kan du kontakte oss direkte:

🇳🇴 **Norge**: 22 45 45 45 eller aleris.no
🇸🇪 **Sverige**: 010-350 00 00 eller aleris.se
🇩🇰 **Danmark**: 38 17 00 00 eller aleris.dk

Vi hjelper deg gjerne med å finne riktig behandling!`;
      } else if (isDanish) {
        mockResponse = `Tak for dit spørgsmål! Dette er en demo-version af Aleris Life.

For at aktivere AI-assistenten skal en Anthropic API-nøgle konfigureres.

I mellemtiden kan du kontakte os direkte:

🇩🇰 **Danmark**: 38 17 00 00 eller aleris.dk
🇸🇪 **Sverige**: 010-350 00 00 eller aleris.se
🇳🇴 **Norge**: 22 45 45 45 eller aleris.no

Vi hjælper dig gerne med at finde den rette behandling!`;
      } else if (isEnglish) {
        mockResponse = `Thank you for your question! This is a demo version of Aleris Life.

To activate the AI assistant, an Anthropic API key needs to be configured.

In the meantime, you can contact us directly:

🇸🇪 **Sweden**: 010-350 00 00 or aleris.se
🇳🇴 **Norway**: 22 45 45 45 or aleris.no
🇩🇰 **Denmark**: 38 17 00 00 or aleris.dk

We're happy to help you find the right care!`;
      } else {
        mockResponse = `Tack för din fråga! Detta är en demo-version av Aleris Life.

För att aktivera AI-assistenten behöver en Anthropic API-nyckel konfigureras.

Under tiden kan du kontakta oss direkt:

🇸🇪 **Sverige**: 010-350 00 00 eller aleris.se
🇳🇴 **Norge**: 22 45 45 45 eller aleris.no
🇩🇰 **Danmark**: 38 17 00 00 eller aleris.dk

Vi hjälper dig gärna att hitta rätt vård!`;
      }

      // Return as streaming format
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(mockResponse)}\n`));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Fetch relevant content from Optimizely if configured
    let contentContext = '';

    if (isOptimizelyConfigured()) {
      try {
        // Extract potential search terms from the user's message
        const searchTerms = extractSearchTerms(lastMessage);

        if (searchTerms.length > 0) {
          // Search for relevant content
          const searchResults = await Promise.all(
            searchTerms.map(term => searchContent(term))
          );
          const allResults = searchResults.flat();

          if (allResults.length > 0) {
            contentContext = `\n\n## Relevant Content from Aleris Website\n${formatLocationsForContext(allResults)}`;
          }
        } else {
          // Fetch general location info for broad questions
          const locations = await fetchLocationPages();
          if (locations.length > 0) {
            contentContext = `\n\n## Available Locations\n${formatLocationsForContext(locations.slice(0, 10))}`;
          }
        }
      } catch (error) {
        console.error('Error fetching Optimizely content:', error);
        // Continue without Optimizely content
      }
    }

    const systemWithContent = SYSTEM_PROMPT + contentContext;

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemWithContent,
      messages,
    });

    // Convert to the format the frontend expects (0: prefixed JSON)
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.textStream) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
