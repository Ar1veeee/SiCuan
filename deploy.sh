#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 

PROJECT_ID="sicuan-boyz4"
REGION="asia-southeast2"
TOPIC_NAME="email-notifications"
FUNCTION_NAME="processEmailQueue"
SERVICE_NAME="sicuan-api"

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

echo -e "${YELLOW}🐳 Building Docker Image with custom Dockerfile...${NC}"

gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Container image built successfully${NC}"
else
    echo -e "${RED}❌ Container build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}🚀 Deploying Cloud Run service...${NC}"

gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2G \
  --cpu 1 \
  --max-instances 5 \
  --timeout 300

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Cloud Run service deployed successfully${NC}"
    
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    echo -e "${GREEN}🌐 Service URL: $SERVICE_URL${NC}"
else
    echo -e "${RED}❌ Cloud Run deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📝 Service Information:${NC}"
echo "• Cloud Function: $FUNCTION_NAME"
echo "• Cloud Run Service: $SERVICE_NAME"
echo "• Service URL: $SERVICE_URL"
echo "• Region: $REGION"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update your frontend to use: $SERVICE_URL"
echo "2. Test the API endpoints"
echo "3. Test the OTP functionality"
echo ""
echo -e "${YELLOW}📊 Monitoring:${NC}"
echo "• Function logs: gcloud functions logs tail $FUNCTION_NAME"
echo "• Cloud Run logs: gcloud run services logs tail $SERVICE_NAME --region=$REGION"
echo "• View in console: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME"