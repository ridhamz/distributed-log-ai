#!/bin/bash
STACK_NAME=$1
REGION=$2
KEY_NAME=$3

if [ -z "$STACK_NAME" ] || [ -z "$REGION" ] || [ -z "$KEY_NAME" ]; then
  echo "Usage: $0 <stack-name> <region> <key-name>"
  exit 1
fi

aws cloudformation deploy \
  --stack-name $STACK_NAME \
  --template-file cloudformation.json \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides KeyName=$KEY_NAME \
  --region $REGION
