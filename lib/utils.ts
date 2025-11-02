import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TravelSuggestion } from '@/types/travel'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateTravelSuggestions(
  destination: string,
  budgets: Record<string, number>
): Promise<TravelSuggestion[]> {
  const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    throw new Error('GROQ API key not found');
  }

  const prompt = `You are a travel expert AI assistant. Generate detailed travel suggestions for ${destination} based on these budgets:
${Object.entries(budgets)
  .map(([category, budget]) => `- ${category}: ₹${budget}`)
  .join('\n')}

Return a list of 8 travel suggestions including a mix of:
- 2-3 accommodation options within the Accommodation budget
- 1-2 flight options within the Flights budget
- 2 restaurant recommendations around ₹1000-3000 per person
- 2 must-do activities or attractions

Format each suggestion with:
- name: The name of the place/service
- category: One of [accommodation, flight, restaurant, activity]
- price: Numeric price in INR
- priceLabel: How price is measured (e.g., "per night", "round trip")
- rating: Rating from 1-5
- description: Short, compelling description
- features: List of 3-4 key features/amenities
- imageUrl: A representative image URL
- Additional fields based on category:
  - For restaurants: cuisine and location
  - For flights: airline and timing
  - For accommodation: location
  - For activities: timing

Make suggestions realistic and varied in price ranges.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: 'You are a travel expert AI that provides detailed, practical travel suggestions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Groq API');
    }

    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);
    return suggestions.suggestions || [];
  } catch (error) {
    console.error('Error generating travel suggestions:', error);
    throw error;
  }
}
