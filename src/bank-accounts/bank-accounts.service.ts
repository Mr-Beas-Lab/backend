import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { ExternalApiService } from '../external-api/external-api.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class BankAccountsService {
  private readonly logger = new Logger(BankAccountsService.name);

  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(createBankAccountDto: CreateBankAccountDto, customerId: string) {
    try {
      this.logger.log('Creating bank account in Kontigo API...');
      
      // Set default values for country_code and account_type if not provided
      const bankAccountData = {
        ...createBankAccountDto,
        country_code: createBankAccountDto.country_code || 'VE',
        account_type: createBankAccountDto.account_type || 'bankaccount',
        customer_id: customerId
      };
      
      // Format the bank account data according to Kontigo API requirements
      const formattedBankAccountData = {
        bank_code: bankAccountData.bank_code,
        country_code: bankAccountData.country_code.toUpperCase(),
        beneficiary_name: bankAccountData.beneficiary_name || '',
        account_number: bankAccountData.account_number || '',
        id_doc_number: bankAccountData.id_doc_number,
        account_type: bankAccountData.account_type.toLowerCase(),
        customer_id: bankAccountData.customer_id,
        phone_number: bankAccountData.phone_number || ''
      };
      
      this.logger.log('Formatted bank account data:', JSON.stringify(formattedBankAccountData, null, 2));
      
      // Send data to Kontigo API
      const kontigoResponse = await this.externalApiService.sendBankAccountToKontigo(formattedBankAccountData);
      
      this.logger.log('Bank account created in Kontigo API:', kontigoResponse);
      
      // Verify that we have a valid bank account ID from Kontigo
      if (!kontigoResponse.id) {
        throw new HttpException(
          'Invalid response from Kontigo API: Missing bank account ID',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      
      // Store bank account data in Firestore
      const firestoreData = {
        kontigoBankAccountId: kontigoResponse.id,
        customer_id: bankAccountData.customer_id,
        bank_code: bankAccountData.bank_code,
        country_code: bankAccountData.country_code,
        beneficiary_name: bankAccountData.beneficiary_name || '',
        account_number: bankAccountData.account_number || '',
        id_doc_number: bankAccountData.id_doc_number,
        account_type: bankAccountData.account_type,
        phone_number: bankAccountData.phone_number || '',
        createdAt: new Date().toISOString()
      };
      
      // Log the bank account data before saving to Firestore
      this.logger.log('Saving bank account data to Firestore:', firestoreData);
      
      // Save to Firestore
      const firestore = this.firebaseService.getFirestore();
      const bankAccountRef = await firestore.collection('bank_accounts').add(firestoreData);
      
      this.logger.log('Bank account data stored in Firestore with ID:', bankAccountRef.id);
      this.logger.log('Stored Kontigo bank account ID:', firestoreData.kontigoBankAccountId);

      // Find the customer document in Firestore using the Kontigo customer ID
      const customerSnapshot = await firestore
        .collection('customers')
        .where('kontigoCustomerId', '==', customerId)
        .get();
      
      if (!customerSnapshot.empty) {
        const customerDoc = customerSnapshot.docs[0];
        // Update customer document with bank account ID
        await customerDoc.ref.update({
          bankAccountId: kontigoResponse.id
        });
        this.logger.log('Updated customer document with bank account ID:', kontigoResponse.id);
      } else {
        this.logger.warn(`Customer with Kontigo ID ${customerId} not found in Firestore`);
      }
      
      return {
        id: bankAccountRef.id,
        ...firestoreData
      };
    } catch (error) {
      this.logger.error('Error creating bank account:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore.collection('bank_accounts').get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      this.logger.error('Error finding all bank accounts:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const firestore = this.firebaseService.getFirestore();
      const doc = await firestore.collection('bank_accounts').doc(id).get();
      
      if (!doc.exists) {
        throw new HttpException('Bank account not found', HttpStatus.NOT_FOUND);
      }
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      this.logger.error('Error finding bank account:', error);
      throw error;
    }
  }

  async findByCustomerId(customerId: string) {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore
        .collection('bank_accounts')
        .where('customer_id', '==', customerId)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      this.logger.error('Error finding bank accounts by customer ID:', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Deleting bank account with ID ${id}...`);
      
      const firestore = this.firebaseService.getFirestore();
      const doc = await firestore.collection('bank_accounts').doc(id).get();
      
      if (!doc.exists) {
        throw new HttpException('Bank account not found', HttpStatus.NOT_FOUND);
      }
      
      const bankAccountData = doc.data();
      if (!bankAccountData) {
        throw new HttpException('Bank account data is empty', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const kontigoBankAccountId = bankAccountData.kontigoBankAccountId;
      const customerId = bankAccountData.customer_id;

      if (!customerId) {
        throw new HttpException(
          'Customer ID is missing from bank account data',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // Delete from Kontigo API
      await this.externalApiService.deleteBankAccountFromKontigo(kontigoBankAccountId, customerId);
      this.logger.log('Bank account deleted from Kontigo API');

      // Delete from Firestore
      await firestore.collection('bank_accounts').doc(id).delete();
      this.logger.log('Bank account deleted from Firestore');
      
      return { id, deleted: true };
    } catch (error) {
      this.logger.error('Error deleting bank account:', error);
      throw error;
    }
  }
} 