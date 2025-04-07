import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
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

      // Update customer document with bank account ID
      const customerRef = firestore.collection('customers').doc(customerId);
      await customerRef.update({
        bankAccountId: kontigoResponse.id
      });
      this.logger.log('Updated customer document with bank account ID:', kontigoResponse.id);
      
      return {
        id: bankAccountRef.id,
        ...firestoreData
      };
    } catch (error) {
      this.logger.error('Error creating bank account:', error);
      throw error;
    }
  }

  async update(id: string, updateBankAccountDto: UpdateBankAccountDto) {
    try {
      this.logger.log(`Updating bank account with ID ${id} in Kontigo API...`);
      
      // Get the bank account from Firestore to get the Kontigo ID
      const firestore = this.firebaseService.getFirestore();
      const bankAccountDoc = await firestore.collection('bank_accounts').doc(id).get();
      
      if (!bankAccountDoc.exists) {
        throw new HttpException('Bank account not found', HttpStatus.NOT_FOUND);
      }
      
      const bankAccountData = bankAccountDoc.data();
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
      
      // Add customer_id to the update data
      const updateData = {
        ...updateBankAccountDto,
        customer_id: customerId
      };
      
      // Send update data to Kontigo API
      const kontigoResponse = await this.externalApiService.updateBankAccountInKontigo(
        kontigoBankAccountId,
        updateData
      );
      
      this.logger.log('Bank account updated in Kontigo API:', kontigoResponse);
      
      // Update the bank account in Firestore
      const updatedBankAccountData = {
        ...bankAccountData,
        ...updateBankAccountDto,
        updatedAt: new Date().toISOString()
      };
      
      // Remove undefined values
      Object.keys(updatedBankAccountData).forEach((key: string) => {
        if (updatedBankAccountData[key as keyof typeof updatedBankAccountData] === undefined) {
          delete updatedBankAccountData[key as keyof typeof updatedBankAccountData];
        }
      });
      
      await firestore.collection('bank_accounts').doc(id).update(updatedBankAccountData);
      
      this.logger.log('Bank account updated in Firestore with ID:', id);
      
      return {
        id,
        ...updatedBankAccountData
      };
    } catch (error) {
      this.logger.error('Error updating bank account:', error);
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
      
      const bankAccountData = doc.data();
      if (!bankAccountData) {
        throw new HttpException('Bank account data is empty', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      const kontigoBankAccountId = bankAccountData.kontigoBankAccountId;
      
      return {
        id: doc.id,
        ...bankAccountData
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
      
      // Delete from Firestore
      await firestore.collection('bank_accounts').doc(id).delete();
      
      return { id, deleted: true };
    } catch (error) {
      this.logger.error('Error removing bank account:', error);
      throw error;
    }
  }
} 