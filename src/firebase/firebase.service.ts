import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-service-account.json';

@Injectable()
export class FirebaseService {
  private readonly firestore: admin.firestore.Firestore;
  private readonly storage: admin.storage.Storage;
  private readonly logger = new Logger(FirebaseService.name);
  private readonly defaultBucketName = 'mrjohn-8ee8b.firebasestorage.app';

  constructor() {
    this.logger.log('Initializing Firebase Service...');
    this.logger.log(`Default bucket name: ${this.defaultBucketName}`);

    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      this.logger.log('No Firebase apps found, initializing new app...');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        storageBucket: this.defaultBucketName,
      });
      this.logger.log('Firebase app initialized with bucket:', admin.app().options.storageBucket);
    } else {
      this.logger.log('Using existing Firebase app with bucket:', admin.app().options.storageBucket);
      // Force update the bucket name
      admin.app().options.storageBucket = this.defaultBucketName;
      this.logger.log('Updated bucket name to:', admin.app().options.storageBucket);
    }

    this.firestore = admin.firestore();
    this.storage = admin.storage();
    
    // Ensure bucket exists and log the bucket name being used
    this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const bucket = this.storage.bucket(this.defaultBucketName);
      this.logger.log(`Checking if bucket ${this.defaultBucketName} exists...`);
      const [exists] = await bucket.exists();
      
      if (!exists) {
        this.logger.warn(`Bucket ${this.defaultBucketName} does not exist.`);
        this.logger.warn('Please create it in the Firebase Console:');
        this.logger.warn(`https://console.firebase.google.com/project/${serviceAccount.project_id}/storage`);
      } else {
        this.logger.log(`Bucket ${this.defaultBucketName} exists and is accessible.`);
      }
    } catch (error: any) {
      this.logger.error(`Error checking bucket: ${error.message}`);
      throw error;
    }
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }

  getStorage(): admin.storage.Storage {
    return this.storage;
  }

  getBucketName(): string {
    // Always return the default bucket name
    return this.defaultBucketName;
  }

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