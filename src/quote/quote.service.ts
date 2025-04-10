import { Injectable} from '@nestjs/common';
import { CreateQuoteDto } from './quote.dto';
import { ExternalApiService } from '../external-api/external-api.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class QuoteService {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly firebaseService: FirebaseService
  ) {}

  
  async createQuote(customerId: string, createQuoteDto: CreateQuoteDto) {
    const { amount, sourceCurrency, destinationCurrency, destinationAccountId } = createQuoteDto;
    const firestore = this.firebaseService.getFirestore();
  
    // Fetch customer data
    const customerRef = await firestore.collection('customers')
      .where('kontigoCustomerId', '==', customerId)
      .get();
  
    if (customerRef.empty) {
      throw new Error('Customer not found');
    }
  
    const customerData = customerRef.docs[0].data() || {};
    const telegramId = customerData.telegram_id || '';
    if (!telegramId) {
      throw new Error('Customer not found');
    }
  
    // Fetch user data
    const userRef = firestore.collection('users').doc(telegramId);
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data() || {};
    const userBalance = userData.realBalance || 0;
  
    // Prepare the payload for the external API
    const amountInCents = amount * 100;
    const payload = {
      amount: amountInCents,
      customer_id: customerId,
      source: {
        payment_rail: 'prefunded_account',
        currency: sourceCurrency || 'USDC',
        account_id: process.env.PRE_FUNDED_ACCOUNT_ID,
      },
      destination: {
        currency: destinationCurrency || 'VES',
        account_id: destinationAccountId,
        payment_rail: 'pagomovil',
      },
      fees_paid_by: 'source',
    };
  
    // Call the external API to create the quote
    const response = await this.externalApiService.createQuote(customerId, payload);
    console.log('api response', response);
  
    // Convert the amounts back to major units (USD and VES)
    const convertedResponse = {
      ...response,
      source_amount: response.source_amount / 100, // Convert to USD
      quoted_amount: response.quoted_amount,
      total_fees: response.total_fees / 100, // Convert to USD
    };
  
    return convertedResponse;
  }
  
  async payQuote(customerId: string, quoteId: string, amount: number) {
    console.log(`Processing payment for quote ${quoteId} by customer ${customerId}`);
    
    const firestore = this.firebaseService.getFirestore();

    // Fetch customer data
    const customerRef = await firestore.collection('customers')
      .where('kontigoCustomerId', '==', customerId)
      .get();

    if (customerRef.empty) {
      throw new Error('Customer not found');
    }

    const customerData = customerRef.docs[0].data() || {};
    const telegramId = customerData.telegram_id || '';
    if (!telegramId) {
      throw new Error('Customer not found');
    }

    // Fetch user data
    const userRef = firestore.collection('users').doc(telegramId);
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.data() || {};
    const userBalance = userData.realBalance || 0;

     const totalCost = amount; 
    // Check if the user has sufficient balance
    if (userBalance < totalCost) {
      throw new Error('Insufficient balance');
    }

    try {
      // Use a transaction to ensure atomicity
      const transaction = await firestore.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        const userDocData = userDoc.data() || {};
        const currentBalance = userDocData.realBalance || 0;

        if (currentBalance < totalCost) {
          throw new Error('Insufficient balance');
        }

        // Deduct the amount from the user's balance (in major units)
        t.update(userRef, { realBalance: currentBalance - totalCost });

        // Call the external API to pay the quote (with amount in cents)
        const source = {
          prefunded_account_id: process.env.PRE_FUNDED_ACCOUNT_ID,
        };
        const paymentResponse = await this.externalApiService.payQuote(quoteId, source);
        console.log('payment response', paymentResponse);

        // Convert the response amounts back to major units
        const convertedResponse = {
          ...paymentResponse,
          source_amount: paymentResponse.source_amount / 100, // Convert to USD
          quoted_amount: paymentResponse.quoted_amount,
          total_fees: paymentResponse.total_fees / 100, // Convert to USD
        };

        return convertedResponse;
      });

      return transaction;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }
}