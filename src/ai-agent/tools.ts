// Tool & schema definitions
export const ANALYSIS_TOOL_NAME = 'log_analysis_tool';
type Tool = any['tools'][number];

export const analysisSchema: Tool['input_schema'] = {
  type: 'object',
  properties: {
    severity: {
      type: 'string',
      description: 'The AI-determined severity: CRITICAL, HIGH, MEDIUM, LOW, or INFO.',
    },
    summary: {
      type: 'string',
      description: "A concise, human-readable summary of the log's core event.",
    },
    root_cause: {
      type: 'string',
      description: 'The likely root cause identified by the AI.',
    },
  },
  required: ['severity', 'summary', 'root_cause'],
};

export const analysisTool: Tool = {
  name: ANALYSIS_TOOL_NAME,
  description:
    'Performs structured analysis on a log message to identify severity, summary, and root cause. MUST return a JSON object.',
  input_schema: analysisSchema,
};
