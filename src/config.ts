import dotenv from 'dotenv';
dotenv.config();

export const config = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.S3_BUCKET_NAME || 'distributed-logs-bucket',
    dynamoTable: process.env.DYNAMO_TABLE || 'LogsMetadata',
  },
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
  },
  app: {
    port: process.env.PORT || 4000,
  },
};
