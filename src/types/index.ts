/**
 * 1. LogMessage: The raw input log event from the AWS stream/queue.
 */
export type LogMessage = {
  id: string;
  timestamp: string;
  service: string;
  environment: 'production' | 'staging' | 'development' | string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'DEBUG' | string;
  message: string;
  metadata?: Record<string, any>;
};

/**
 * 2. AiAnalysisResult: The structured output from the Gemini AI Agent.
 */
export type AiAnalysisResult = {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' | 'ERROR';
  summary: string;
  root_cause: string;
  confidence?: number;
};

/**
 * 3. ProcessedLogRecord: The final, combined record to be stored in the database.
 */
export type ProcessedLogRecord = {
  id: string;
  timestamp: string;
  service: string;
  original_log: LogMessage;
  ai_analysis: AiAnalysisResult;
};
