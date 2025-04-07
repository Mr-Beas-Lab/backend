import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BankAccountsService } from '../bank-accounts/bank-accounts.service';
import { CreateBankAccountDto } from '../bank-accounts/dto/create-bank-account.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly bankAccountsService: BankAccountsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'The customer has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get('telegram/:telegramId')
  @ApiOperation({ summary: 'Get a customer by Telegram ID' })
  @ApiResponse({ status: 200, description: 'Return the customer.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  findByTelegramId(@Param('telegramId') telegramId: string) {
    return this.customersService.findByTelegramId(telegramId);
  }

  @Post(':customerId/bank-accounts')
  @ApiOperation({ summary: 'Create a bank account for a customer' })
  @ApiResponse({ status: 201, description: 'The bank account has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  createBankAccount(
    @Param('customerId') customerId: string,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ) {
    return this.bankAccountsService.create(createBankAccountDto, customerId);
  }

  @Get(':customerId/bank-accounts')
  @ApiOperation({ summary: 'Get all bank accounts for a customer' })
  @ApiResponse({ status: 200, description: 'Return all bank accounts for the customer.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  getCustomerBankAccounts(@Param('customerId') customerId: string) {
    return this.bankAccountsService.findByCustomerId(customerId);
  }

  @Get(':customerId/bank-accounts/:id')
  @ApiOperation({ summary: 'Get a specific bank account by ID for a customer' })
  @ApiResponse({ status: 200, description: 'Return the bank account.' })
  @ApiResponse({ status: 404, description: 'Bank account not found.' })
  getCustomerBankAccount(
    @Param('customerId') customerId: string,
    @Param('id') id: string,
  ) {
    return this.bankAccountsService.findOne(id);
  }
} 