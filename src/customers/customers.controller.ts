import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { IdentityDocumentDto } from './dto/identity-document.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'The customer has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'idDocFrontFile', maxCount: 1 },
    { name: 'idDocBackFile', maxCount: 1 },
  ]))
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @UploadedFiles() files: { 
      idDocFrontFile?: Express.Multer.File[], 
      idDocBackFile?: Express.Multer.File[] 
    }
  ) {
    // Initialize identityDocument if it doesn't exist
    if (!createCustomerDto.identityDocument) {
      createCustomerDto.identityDocument = {} as IdentityDocumentDto;
    }

    // Convert string to object if needed
    if (typeof createCustomerDto.identityDocument === 'string') {
      try {
        createCustomerDto.identityDocument = JSON.parse(createCustomerDto.identityDocument);
      } catch (e) {
        createCustomerDto.identityDocument = {} as IdentityDocumentDto;
      }
    }

    // Add files to the DTO
    if (files.idDocFrontFile?.[0]) {
      (createCustomerDto.identityDocument as IdentityDocumentDto).idDocFrontFile = files.idDocFrontFile[0];
    }
    if (files.idDocBackFile?.[0]) {
      (createCustomerDto.identityDocument as IdentityDocumentDto).idDocBackFile = files.idDocBackFile[0];
    }

    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers.' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by id' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Return the customer.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'The customer has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'idDocFrontFile', maxCount: 1 },
    { name: 'idDocBackFile', maxCount: 1 },
  ]))
  update(
    @Param('id') id: string, 
    @Body() updateCustomerDto: UpdateCustomerDto,
    @UploadedFiles() files: { 
      idDocFrontFile?: Express.Multer.File[], 
      idDocBackFile?: Express.Multer.File[] 
    }
  ) {
    // Initialize identityDocument if it doesn't exist
    if (!updateCustomerDto.identityDocument) {
      updateCustomerDto.identityDocument = {} as IdentityDocumentDto;
    }

    // Convert string to object if needed
    if (typeof updateCustomerDto.identityDocument === 'string') {
      try {
        updateCustomerDto.identityDocument = JSON.parse(updateCustomerDto.identityDocument);
      } catch (e) {
        updateCustomerDto.identityDocument = {} as IdentityDocumentDto;
      }
    }

    // Add files to the DTO
    if (files.idDocFrontFile?.[0]) {
      (updateCustomerDto.identityDocument as IdentityDocumentDto).idDocFrontFile = files.idDocFrontFile[0];
    }
    if (files.idDocBackFile?.[0]) {
      (updateCustomerDto.identityDocument as IdentityDocumentDto).idDocBackFile = files.idDocBackFile[0];
    }

    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'The customer has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}