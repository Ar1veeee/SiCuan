#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 

PROJECT_ID="your-project-id"
REGION="asia-southeast2"
TOPIC_NAME="email-notifications"
FUNCTION_NAME="processEmailQueue"

echo -e "${GREEN}🚀 Starting deployment process for SiCuan Backend${NC}"

if [ -z "$MAILJET_API_KEY" ] || [ -z "$MAILJET_SECRET_KEY" ] || [ -z "$MAILJET_SENDER" ]; then
    echo -e "${RED}❌ Error: MAILJET_API_KEY, MAILJET_SECRET_KEY, and MAILJET_SENDER must be set${NC}"
    echo "Please set them using:"
    echo "export MAILJET_API_KEY=your_api_key"
    echo "export MAILJET_SECRET_KEY=your_secret_key"
    echo "export MAILJET_SENDER=your_email@domain.com"
    exit 1
fi

echo -e "${YELLOW}📋 Setting Google Cloud project...${NC}"
gcloud config set project $PROJECT_ID

echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable pubsub.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

echo -e "${YELLOW}📬 Creating Pub/Sub topic...${NC}"
if gcloud pubsub topics describe $TOPIC_NAME > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Topic $TOPIC_NAME already exists${NC}"
else
    gcloud pubsub topics create $TOPIC_NAME
    echo -e "${GREEN}✅ Topic $TOPIC_NAME created${NC}"
fi

echo -e "${YELLOW}☁️ Deploying Cloud Function...${NC}"
cd functions/email-processor

gcloud functions deploy $FUNCTION_NAME \
  --runtime nodejs18 \
  --trigger-topic $TOPIC_NAME \
  --source . \
  --entry-point processEmailQueue \
  --set-env-vars MAILJET_API_KEY=$MAILJET_API_KEY,MAILJET_SECRET_KEY=$MAILJET_SECRET_KEY,MAILJET_SENDER=$MAILJET_SENDER \
  --region $REGION \
  --memory 256MB \
  --timeout 540s

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cloud Function deployed successfully${NC}"
else
    echo -e "${RED}❌ Cloud Function deployment failed${NC}"
    exit 1
fi

cd ../..

echo -e "${YELLOW}🐳 Building and deploying Cloud Run service...${NC}"

npm run build

gcloud run deploy sicuan-api \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --port 5000 \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$PROJECT_ID,EMAIL_TOPIC_NAME=$TOPIC_NAME \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cloud Run service deployed successfully${NC}"
else
    echo -e "${RED}❌ Cloud Run deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update your frontend to use the new Cloud Run URL"
echo "2. Test the OTP functionality"
echo "3. Monitor logs using: gcloud functions logs tail $FUNCTION_NAME"
echo "4. Monitor Cloud Run logs using: gcloud run services logs tail sicuan-api"