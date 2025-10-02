import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({});
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-opus-20240229';
