import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ProcessedLogRecord } from '../types';

// Initialize SNS client
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

// Your SNS topic ARN (create it in AWS SNS console)
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN as string;

export async function sendSNSAlert(record: ProcessedLogRecord) {
  const subject = `[ALERT] Critical log from ${record.service}`;
  const message = `
A critical log has been detected:

Service: ${record.service}
Timestamp: ${record.timestamp}
Level: ${record.original_log.level}
Message: ${record.original_log.message}

AI Analysis:
Severity: ${record.ai_analysis.severity}
Summary: ${record.ai_analysis.summary}
Root Cause: ${record.ai_analysis.root_cause}
`;

  const command = new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Subject: subject,
    Message: message,
  });

  try {
    await snsClient.send(command);
    console.log('Alert sent for log:', record.id);
  } catch (err) {
    console.error('Failed to send alert:', err);
  }
}
