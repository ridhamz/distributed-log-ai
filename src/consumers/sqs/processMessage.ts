import { analyzeLog } from '../../ai-agent';
import { sendSNSAlert } from '../../alerts';
import { saveProcessedLog } from '../../dynamoDB';
import { LogMessage, ProcessedLogRecord } from '../../types';
import deleteMessages from './deleteMessages';
import { Message } from '@aws-sdk/client-sqs';

export default async function processMessages(
  sqsClient: any,
  QUEUE_URL: string,
  messages: Message[]
) {
  const deleteBatch: { Id: string; ReceiptHandle: string }[] = [];
  const processingPromises = messages.map(async (message) => {
    if (!message.Body || !message.ReceiptHandle) return;

    try {
      // 1. Parse the message body using your LogMessage type
      const logData: LogMessage = JSON.parse(message.Body);

      // 2. Call the AI Agent for analysis
      const aiAnalysis = await analyzeLog(logData);

      // 3. Create the final record
      const finalRecord: ProcessedLogRecord = {
        id: logData.id,
        timestamp: logData.timestamp,
        service: logData.service,
        original_log: logData,
        ai_analysis: aiAnalysis,
      };

      // --- 4. Store/Alert Logic (Placeholder) ---
      await saveProcessedLog(finalRecord);

      if (finalRecord.ai_analysis.severity === 'CRITICAL') {
        await sendSNSAlert(finalRecord);
      }

      // Successfully processed: Mark for deletion
      deleteBatch.push({
        Id: finalRecord.id,
        ReceiptHandle: message.ReceiptHandle,
      });
    } catch (error) {
      console.error(`Failed to process message ID ${message.MessageId}:`, error);
    }
  });

  await Promise.allSettled(processingPromises);

  // --- 5. Delete Processed Messages ---
  if (deleteBatch.length > 0) {
    await deleteMessages(sqsClient, QUEUE_URL, deleteBatch);
  }
}
