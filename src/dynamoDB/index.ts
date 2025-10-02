import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { ProcessedLogRecord } from '../types';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function saveProcessedLog(record: ProcessedLogRecord) {
  const command = new PutItemCommand({
    TableName: 'ProcessedLogs',
    Item: {
      id: { S: record.id },
      timestamp: { S: record.timestamp },
      service: { S: record.service },
      original_log: { S: JSON.stringify(record.original_log) },
      ai_analysis: { S: JSON.stringify(record.ai_analysis) },
    },
  });

  try {
    await client.send(command);
    console.log('Saved processed log:', record.id);
  } catch (err) {
    console.error('Failed to save processed log:', err);
  }
}
