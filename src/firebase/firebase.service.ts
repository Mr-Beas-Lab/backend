import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private readonly firestore: admin.firestore.Firestore;
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private configService: ConfigService) {
    this.logger.log('Initializing Firebase Service...');

    // Validate Firebase configuration
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID') || process.env.FIREBASE_PROJECT_ID;
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL') || process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY') || process.env.FIREBASE_PRIVATE_KEY;
    
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Missing Firebase configuration. Please check your environment variables: ' +
        'FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
      );
    }

    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      this.logger.log('No Firebase apps found, initializing new app...');
      
      const firebaseConfig = {
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      };

      try {
        admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig)
        });
        this.logger.log('Firebase app initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize Firebase app:', error);
        throw error;
      }
    } else {
      this.logger.log('Using existing Firebase app');
    }

    this.firestore = admin.firestore();
  
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }

  // Your existing CRUD operations remain exactly the same
  async createCustomer(customerData: any): Promise<any> {
    const customerRef = this.firestore.collection('customers').doc();
    await customerRef.set(customerData);
    return { id: customerRef.id, ...customerData };
  }

  async updateCustomer(customerId: string, customerData: any): Promise<any> {
    const customerRef = this.firestore.collection('customers').doc(customerId);
    await customerRef.update(customerData);
    return { id: customerId, ...customerData };
  }

  async getCustomer(customerId: string): Promise<any> {
    const customerRef = this.firestore.collection('customers').doc(customerId);
    const doc = await customerRef.get();
    if (!doc.exists) {
      throw new Error('Customer not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async getAllCustomers(): Promise<any[]> {
    const snapshot = await this.firestore.collection('customers').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}