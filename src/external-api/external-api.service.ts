import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);
  private readonly apiUrl = 'https://sandbox-api.kontigo.lat/v1';
  private readonly apiKey = process.env.KONTIGO_API_KEY;
  private readonly organizationId = process.env.ORGANIZATION_ID;

  constructor() {
    if (!this.apiKey) {
      this.logger.warn('KONTIGO_API_KEY environment variable is not set');
    }
  }

  private convertAllValuesToString(obj: any): any {
    if (obj === null || obj === undefined) {
      return '';
    }
    
    if (typeof obj === 'object') {
      const result: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = this.convertAllValuesToString(obj[key]);
        }
      }
      return result;
    }
    return String(obj);
  }

  async sendCustomerToKontigo(customerData: any) {
    try {
      this.logger.log('Sending customer data to Kontigo API...');
      
      if (!this.apiKey) {
        throw new HttpException('Kontigo API key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      // Convert all values to strings
      const stringifiedData = this.convertAllValuesToString(customerData);
      
      this.logger.log('Sending data to Kontigo API:', JSON.stringify(stringifiedData, null, 2));
      
      const response = await axios.post(
        `${this.apiUrl}/customers`,
        stringifiedData,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-api-key': this.apiKey
          }
        }
      );

      this.logger.log('Successfully sent customer data to Kontigo API');
      this.logger.log('Kontigo API response:', JSON.stringify(response.data, null, 2));
      
      // Check if the response contains the expected data
      if (!response.data || !response.data.id) {
        this.logger.warn('Unexpected response format from Kontigo API:', response.data);
        throw new HttpException(
          'Invalid response from Kontigo API: Missing customer ID',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      
      return response.data;
    } catch (error: any) {
      this.logger.error('Error sending customer data to Kontigo API:', error.response?.data || error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data?.message || 'Error from Kontigo API';
        const errorDetails = error.response.data?.errors || error.response.data;
        
        this.logger.error('Kontigo API error details:', errorDetails);
        
        throw new HttpException(
          {
            message: errorMessage,
            details: errorDetails
          },
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else if (error.request) {
        // The request was made but no response was received
        this.logger.error('No response received from Kontigo API');
        
        throw new HttpException(
          'No response received from Kontigo API',
          HttpStatus.GATEWAY_TIMEOUT
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        this.logger.error('Error setting up request to Kontigo API:', error.message);
        
        throw new HttpException(
          'Error setting up request to Kontigo API',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async sendBankAccountToKontigo(bankAccountData: any) {
    try {
      this.logger.log('Sending bank account data to Kontigo API...');
      
      if (!this.apiKey) {
        throw new HttpException('Kontigo API key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      // Extract customer_id from bankAccountData
      const customerId = bankAccountData.customer_id;
      if (!customerId) {
        throw new HttpException(
          'Customer ID is required to create a bank account',
          HttpStatus.BAD_REQUEST
        );
      }
      
      // Format the data according to Kontigo API requirements
      // Using the exact format specified by the user
      const formattedData = {
        bank_code: bankAccountData.bank_code,
        country_code: bankAccountData.country_code.toUpperCase(),
        beneficiary_name: bankAccountData.beneficiary_name,
        account_number: bankAccountData.account_number,
        id_doc_number: bankAccountData.id_doc_number,
        phone_number: bankAccountData.phone_number ? 
          bankAccountData.phone_number.startsWith('+') ? 
            bankAccountData.phone_number : 
            `+${bankAccountData.phone_number}` : 
          undefined,
        account_type: bankAccountData.account_type.toLowerCase()
      };
      
      // Remove undefined values
      Object.keys(formattedData).forEach((key) => {
        if (formattedData[key as keyof typeof formattedData] === undefined) {
          delete formattedData[key as keyof typeof formattedData];
        }
      });
      
      this.logger.log('Sending data to Kontigo API:', JSON.stringify(formattedData, null, 2));
      
      // Use the correct endpoint format for bank accounts
      const response = await axios.post(
        `${this.apiUrl}/customers/${customerId}/bank-accounts`,
        formattedData,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-api-key': this.apiKey,
            'x-api-version': '2024-01-01'
          }
        }
      );

      this.logger.log('Successfully sent bank account data to Kontigo API');
      this.logger.log('Kontigo API response:', JSON.stringify(response.data, null, 2));
      
      // Check if the response contains the expected data
      if (!response.data || !response.data.id) {
        this.logger.warn('Unexpected response format from Kontigo API:', response.data);
        throw new HttpException(
          'Invalid response from Kontigo API: Missing bank account ID',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      
      return response.data;
    } catch (error: any) {
      this.logger.error('Error sending bank account data to Kontigo API:', error.response?.data || error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data?.message || 'Error from Kontigo API';
        const errorDetails = error.response.data?.errors || error.response.data;
        
        this.logger.error('Kontigo API error details:', errorDetails);
        
        // Check for specific validation errors
        if (error.response.status === 400) {
          this.logger.error('Validation error from Kontigo API. Full response:', JSON.stringify(error.response.data, null, 2));
          
          // If there are specific validation errors, include them in the error message
          if (error.response.data?.errors) {
            const validationErrors = Object.entries(error.response.data.errors)
              .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
              .join('; ');
            
            throw new HttpException(
              {
                message: `Validation error: ${validationErrors}`,
                details: error.response.data
              },
              HttpStatus.BAD_REQUEST
            );
          }
        }
        
        throw new HttpException(
          {
            message: errorMessage,
            details: errorDetails
          },
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else if (error.request) {
        // The request was made but no response was received
        this.logger.error('No response received from Kontigo API');
        
        throw new HttpException(
          'No response received from Kontigo API',
          HttpStatus.GATEWAY_TIMEOUT
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        this.logger.error('Error setting up request to Kontigo API:', error.message);
        
        throw new HttpException(
          'Error setting up request to Kontigo API',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async deleteBankAccountFromKontigo(bankAccountId: string, customerId: string) {
    try {
      this.logger.log(`Deleting bank account ${bankAccountId} from Kontigo API...`);
      
      if (!this.apiKey) {
        throw new HttpException('Kontigo API key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      if (!customerId) {
        throw new HttpException(
          'Customer ID is required to delete a bank account',
          HttpStatus.BAD_REQUEST
        );
      }
      
      const response = await axios.delete(
        `${this.apiUrl}/customers/${customerId}/bank-accounts/${bankAccountId}`,
        {
          headers: {
            'accept': 'application/json',
            'x-api-key': this.apiKey
          }
        }
      );

      this.logger.log('Successfully deleted bank account from Kontigo API');
      this.logger.log('Kontigo API response:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error: any) {
      this.logger.error('Error deleting bank account from Kontigo API:', error.response?.data || error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data?.message || 'Error from Kontigo API';
        const errorDetails = error.response.data?.errors || error.response.data;
        
        this.logger.error('Kontigo API error details:', errorDetails);
        
        throw new HttpException(
          {
            message: errorMessage,
            details: errorDetails
          },
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else if (error.request) {
        // The request was made but no response was received
        this.logger.error('No response received from Kontigo API');
        
        throw new HttpException(
          'No response received from Kontigo API',
          HttpStatus.GATEWAY_TIMEOUT
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        this.logger.error('Error setting up request to Kontigo API:', error.message);
        
        throw new HttpException(
          'Error setting up request to Kontigo API',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async getExchangeRate(sourceCurrency: string, destinationCurrency: string) {
    try {
      this.logger.log(`Fetching exchange rate from Kontigo API...`);
      
      if (!this.apiKey) {
        throw new HttpException('Kontigo API key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      const response = await axios.get(
        `${this.apiUrl}/organizations/${this.organizationId}/exchange-rates?source_currency=${sourceCurrency}&destination_currency=${destinationCurrency}`,
        {
          headers: {
            'accept': 'application/json',
            'x-api-key': this.apiKey
          }
        }
      );

      this.logger.log('Successfully fetched exchange rate from Kontigo API');
      this.logger.log('Kontigo API response:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error: any) {
      this.logger.error('Error fetching exchange rate from Kontigo API:', error.response?.data || error.message);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Error from Kontigo API';
        const errorDetails = error.response.data?.errors || error.response.data;
        
        this.logger.error('Kontigo API error details:', errorDetails);
        
        throw new HttpException(
          {
            message: errorMessage,
            details: errorDetails
          },
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else if (error.request) {
        this.logger.error('No response received from Kontigo API');
        
        throw new HttpException(
          'No response received from Kontigo API',
          HttpStatus.GATEWAY_TIMEOUT
        );
      } else {
        this.logger.error('Error setting up request to Kontigo API:', error.message);
        
        throw new HttpException(
          'Error setting up request to Kontigo API',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
  async createQuote(customerId: string, quoteData: any) {
    try {
      this.logger.log(`Creating quote for customer ${customerId} in Kontigo API...`);
  
      if (!this.apiKey) {
        throw new HttpException('Kontigo API key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
      // Add customerId to the quoteData
      const dataWithCustomerId = {
        ...quoteData,
        customer_id: customerId, 
      };
  
 
      this.logger.log('Sending data to Kontigo API:', JSON.stringify(dataWithCustomerId, null, 2));
  
      const response = await axios.post(
        `${this.apiUrl}/transfers/quote`,
        dataWithCustomerId,
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-api-key': this.apiKey,
          },
        },
      );
  
      this.logger.log('Successfully created quote in Kontigo API');
      this.logger.log('Kontigo API response:', JSON.stringify(response.data, null, 2));
  
      return response.data;
    } catch (error: any) {
      this.logger.error('Error creating quote in Kontigo API:', error.response?.data || error.message);
  
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Error from Kontigo API';
        const errorDetails = error.response.data?.errors || error.response.data;
  
        this.logger.error('Kontigo API error details:', errorDetails);
  
        throw new HttpException(
          {
            message: errorMessage,
            details: errorDetails,
          },
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else if (error.request) {
        this.logger.error('No response received from Kontigo API');
  
        throw new HttpException(
          'No response received from Kontigo API',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      } else {
        this.logger.error('Error setting up request to Kontigo API:', error.message);
  
        throw new HttpException(
          'Error setting up request to Kontigo API',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async payQuote(quoteId: string, source: any) {
    const prefunded_account_id = source.prefunded_account_id;
    
    try {
      this.logger.log(`Paying quote ${quoteId} in Kontigo API...`);
      
      if (!this.apiKey) {
        throw new HttpException('Kontigo API key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!prefunded_account_id) {
        throw new HttpException('Prefunded account ID is required', HttpStatus.BAD_REQUEST);
      }

      const response = await axios.post(
        `${this.apiUrl}/transfers/quote/${quoteId}/pay`,
        {
          source: {
            prefunded_account_id
          }
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey, // Assuming this is required
          },
        }
      );

      this.logger.log('Successfully paid quote in Kontigo API');
      return response.data;
      
    } catch (error: any) {
      this.logger.error('Error paying quote:', error.response?.data || error.message);
      
      if (error.response) {
        throw new HttpException(
          error.response.data?.message || 'Payment failed',
          error.response.status,
          {
            description: JSON.stringify(error.response.data)
          }
        );
      }
      
      throw new HttpException(
        'Failed to process payment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
}
} 