#!/bin/bash
STACK_NAME=$1
REGION=$2
KEY_PATH=$3

if [ -z "$STACK_NAME" ] || [ -z "$REGION" ] || [ -z "$KEY_PATH" ]; then
  echo "Usage: $0 <stack-name> <region> <key-path>"
  exit 1
fi

INSTANCE_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:aws:cloudformation:stack-name,Values=$STACK_NAME" "Name=instance-state-name,Values=running" \
  --query "Reservations[0].Instances[0].InstanceId" \
  --region $REGION --output text)

PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --region $REGION \
  --query "Reservations[0].Instances[0].PublicIpAddress" --output text)

ssh -o StrictHostKeyChecking=no -i $KEY_PATH ec2-user@$PUBLIC_IP << 'EOF'
  cd /home/ec2-user/app
  git pull
  npm install
  pm2 restart distributed-log-ai
EOF
