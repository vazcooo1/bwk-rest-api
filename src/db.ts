import mongoose, { ConnectOptions } from 'mongoose';
import { config } from './config';
import { emitProgressUpdate } from './socket';

export async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongodbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions);
    console.log('Connected to MongoDB')
    emitProgressUpdate('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}