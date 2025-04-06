import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-service-account.json'; // Replace with your Firebase service account file

@Injectable()
export class FirebaseService {
  private firestore: FirebaseFirestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: process.env.DATABASE_URL,
      });
    }
    this.firestore = admin.firestore();
  }

  getFirestore() {
    return this.firestore;
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