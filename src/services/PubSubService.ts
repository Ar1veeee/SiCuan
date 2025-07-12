import { PubSub } from '@google-cloud/pubsub';

interface EmailMessage {
  to: string;
  subject: string;
  otp: string;
  type: 'otp' | 'notification';
}

class PubSubService {
  private pubsub: PubSub;
  private topicName: string;

  constructor() {
    this.pubsub = new PubSub();
    this.topicName = process.env.EMAIL_TOPIC_NAME || 'email-notifications';
  }

  async publishEmailMessage(message: EmailMessage): Promise<string> {
    try {
      const topic = this.pubsub.topic(this.topicName);
      
      const [exists] = await topic.exists();
      if (!exists) {
        await topic.create();
        console.log(`Topic ${this.topicName} created`);
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));
      const messageId = await topic.publish(messageBuffer);
      
      console.log(`Message ${messageId} published to topic ${this.topicName}`);
      return messageId;
    } catch (error) {
      console.error('Error publishing message to Pub/Sub:', error);
      throw error;
    }
  }
}

export default new PubSubService();