type ToneType = 'formal' | 'friendly' | 'urgent';

const TONE_INSTRUCTIONS = {
  formal: `Rewrite this email in a formal, professional tone. Use proper business language, maintain respectful distance, and ensure impeccable grammar. Keep the core message unchanged.`,
  friendly: `Rewrite this email in a friendly, warm tone. Use casual but professional language, add warmth and approachability, and ensure proper grammar. Keep the core message unchanged.`,
  urgent: `Rewrite this email in an urgent, action-oriented tone. Be direct and concise, emphasize time-sensitivity, and ensure proper grammar. Keep the core message unchanged.`,
};

export async function rewriteEmail(email: string, tone: ToneType): Promise<string> {
  const instruction = TONE_INSTRUCTIONS[tone];

  const prompt = `${instruction}

Original email:
${email}

Rewritten email:`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert email writer and editor. You rewrite emails to match specific tones while fixing grammar and maintaining the original meaning.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to rewrite email');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling AI service:', error);
    throw error;
  }
}
