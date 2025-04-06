import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private readonly collection = 'customers';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const firestore = this.firebaseService.getFirestore();
    const docRef = await firestore.collection(this.collection).add(createCustomerDto);
    return { id: docRef.id, ...createCustomerDto };
  }

  async findAll() {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore.collection(this.collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findOne(id: string) {
    const firestore = this.firebaseService.getFirestore();
    const doc = await firestore.collection(this.collection).doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException('Customer not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException('Customer not found');
    }
    // Convert the DTO to a plain object for Firebase update
    const updateData = Object.entries(updateCustomerDto).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    await docRef.update(updateData);
    return { id, ...updateData };
  }

  async remove(id: string) {
    const firestore = this.firebaseService.getFirestore();
    const docRef = firestore.collection(this.collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException('Customer not found');
    }
    await docRef.delete();
    return { id };
  }
}