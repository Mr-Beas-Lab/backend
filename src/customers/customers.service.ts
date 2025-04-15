import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ExternalApiService } from 'src/external-api/external-api.service';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly externalApiService: ExternalApiService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      this.logger.log('Creating customer in Kontigo API...');
      
      // Prepare data for Kontigo API with only essential fields
      const kontigoData = {
        type: createCustomerDto.type,
        email: createCustomerDto.email,
        phone_number: createCustomerDto.phone_number,
        first_name: createCustomerDto.legal_name,
        last_name: '' // Empty string for last_name
      };

      // Send data to Kontigo API
      const kontigoResponse = await this.externalApiService.sendCustomerToKontigo(kontigoData);
      
      this.logger.log('Customer created in Kontigo API:', kontigoResponse);
      
      // Verify that we have a valid customer ID from Kontigo
      if (!kontigoResponse.id) {
        throw new HttpException(
          'Invalid response from Kontigo API: Missing customer ID',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      
      // Store only essential data in Firestore
      const customerData = {
        kontigoCustomerId: kontigoResponse.id, 
        telegram_id: createCustomerDto.telegram_id,
        email: createCustomerDto.email,
        legal_name: createCustomerDto.legal_name,
        type: createCustomerDto.type,
        phone_number: createCustomerDto.phone_number,
        createdAt: new Date().toISOString()
      };
      
      // Log the customer data before saving to Firestore
      this.logger.log('Saving customer data to Firestore:', customerData);
      
      // Save to Firestore
      const firestore = this.firebaseService.getFirestore();
      const customerRef = await firestore.collection('customers').add(customerData);
      
      this.logger.log('Customer data stored in Firestore with ID:', customerRef.id);
      this.logger.log('Stored Kontigo customer ID:', customerData.kontigoCustomerId);
      
      return {
        id: customerRef.id,
        ...customerData
      };
    } catch (error) {
      this.logger.error('Error creating customer:', error);
      throw error;
    }
  }

  async findByTelegramId(telegramId: string) {
    const firestore = this.firebaseService.getFirestore();
    const snapshot = await firestore
      .collection('customers')
      .where('telegram_id', '==', telegramId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
} 