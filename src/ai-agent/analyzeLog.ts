import { LogMessage, AiAnalysisResult } from '../types';
import { anthropic, CLAUDE_MODEL } from './client';
import { analysisTool, ANALYSIS_TOOL_NAME } from './tools';

// Use correct type hints for messages
type Content = any['messages'][number]['content'];

export async function analyzeLog(logData: LogMessage): Promise<AiAnalysisResult> {
  const systemPrompt = `You are an expert log analysis AI. Analyze the user-provided log message. Identify the root cause, assign a severity (CRITICAL, HIGH, MEDIUM, LOW, or INFO), and provide a one-sentence summary. Your response MUST be a valid JSON object that strictly adheres to the requested schema.`;

  const userPrompt = `
    Analyze this log:
    Service: ${logData.service}
    Timestamp: ${logData.timestamp}
    Level: ${logData.level}
    Message: "${logData.message}"
  `;

  const messagesContent: Content = [{ type: 'text', text: userPrompt }];

  const payload: any = {
    model: CLAUDE_MODEL,
    system: systemPrompt,
    max_tokens: 2048,
    messages: [{ role: 'user', content: messagesContent }],
    tools: [analysisTool],
    tool_choice: { type: 'tool', name: ANALYSIS_TOOL_NAME },
  };

  try {
    const response = await anthropic.messages.create(payload);

    const toolUse = response.content.find(
      (c) => c.type === 'tool_use' && c.name === ANALYSIS_TOOL_NAME
    );

    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('Claude did not return a valid tool_use JSON response.');
    }

    return toolUse.input as AiAnalysisResult;
  } catch (error) {
    console.error('Claude analysis failed:', error);
    return {
      severity: 'ERROR',
      summary: 'AI analysis failed',
      root_cause: 'Anthropic API failure',
    };
  }
}
