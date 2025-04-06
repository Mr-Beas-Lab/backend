"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CustomersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const uuid_1 = require("uuid");
let CustomersService = CustomersService_1 = class CustomersService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
        this.collection = 'customers';
        this.logger = new common_1.Logger(CustomersService_1.name);
    }
    async uploadFile(file, customerId, side) {
        try {
            const storage = this.firebaseService.getStorage();
            const fileExtension = file.originalname.split('.').pop();
            // Create a more organized folder structure: customers/{customerId}/{side}.{extension}
            const fileName = `customers/${customerId}/${side}.${fileExtension}`;
            const bucketName = this.firebaseService.getBucketName();
            this.logger.log(`Uploading file to bucket: ${bucketName}`);
            this.logger.log(`File path: ${fileName}`);
            // Get the bucket directly using the bucket name
            const bucket = storage.bucket(bucketName);
            const fileRef = bucket.file(fileName);
            // Upload the file
            this.logger.log('Starting file upload...');
            await fileRef.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype,
                },
            });
            this.logger.log('File upload completed');
            // Make the file publicly accessible
            this.logger.log('Making file public...');
            await fileRef.makePublic();
            this.logger.log('File is now public');
            // Get the public URL - use the correct format for Firebase Storage
            // The correct format is: https://firebasestorage.googleapis.com/v0/b/{bucketName}/o/{fileName}?alt=media
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(fileName)}?alt=media`;
            this.logger.log(`Public URL: ${publicUrl}`);
            return publicUrl;
        }
        catch (error) {
            this.logger.error('File upload error:', error);
            if (error.response && error.response.data) {
                this.logger.error('Error response:', error.response.data);
            }
            throw new common_1.BadRequestException('Failed to upload file. Please try again.');
        }
    }
    parseObjectIfString(value) {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch (e) {
                return value;
            }
        }
        return value;
    }
    async create(createCustomerDto) {
        try {
            const firestore = this.firebaseService.getFirestore();
            // Create a new document with a custom ID that starts with "cust_"
            const customerId = `cust_${(0, uuid_1.v4)()}`;
            const docRef = firestore.collection(this.collection).doc(customerId);
            // Parse address and identityDocument if they're strings
            const parsedDto = {
                ...createCustomerDto,
                address: this.parseObjectIfString(createCustomerDto.address),
                identityDocument: this.parseObjectIfString(createCustomerDto.identityDocument)
            };
            // Handle file uploads if they exist
            if (parsedDto.identityDocument?.idDocFrontFile) {
                const frontUrl = await this.uploadFile(parsedDto.identityDocument.idDocFrontFile, customerId, 'front');
                parsedDto.identityDocument.idDocFrontUrl = frontUrl;
                delete parsedDto.identityDocument.idDocFrontFile;
            }
            if (parsedDto.identityDocument?.idDocBackFile) {
                const backUrl = await this.uploadFile(parsedDto.identityDocument.idDocBackFile, customerId, 'back');
                parsedDto.identityDocument.idDocBackUrl = backUrl;
                delete parsedDto.identityDocument.idDocBackFile;
            }
            // Save the customer data
            await docRef.set(parsedDto);
            return { id: customerId, ...parsedDto };
        }
        catch (error) {
            console.error('Create customer error:', error);
            throw new common_1.BadRequestException('Failed to create customer. Please try again.');
        }
    }
    async findAll() {
        const firestore = this.firebaseService.getFirestore();
        const snapshot = await firestore.collection(this.collection).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async findOne(id) {
        const firestore = this.firebaseService.getFirestore();
        const doc = await firestore.collection(this.collection).doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return { id: doc.id, ...doc.data() };
    }
    async update(id, updateCustomerDto) {
        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        // Parse address and identityDocument if they're strings
        const parsedDto = {
            ...updateCustomerDto,
            address: this.parseObjectIfString(updateCustomerDto.address),
            identityDocument: this.parseObjectIfString(updateCustomerDto.identityDocument)
        };
        // Handle file uploads if they exist
        if (parsedDto.identityDocument?.idDocFrontFile) {
            const frontUrl = await this.uploadFile(parsedDto.identityDocument.idDocFrontFile, id, 'front');
            parsedDto.identityDocument.idDocFrontUrl = frontUrl;
            delete parsedDto.identityDocument.idDocFrontFile;
        }
        if (parsedDto.identityDocument?.idDocBackFile) {
            const backUrl = await this.uploadFile(parsedDto.identityDocument.idDocBackFile, id, 'back');
            parsedDto.identityDocument.idDocBackUrl = backUrl;
            delete parsedDto.identityDocument.idDocBackFile;
        }
        await docRef.update(parsedDto);
        return { id, ...parsedDto };
    }
    async remove(id) {
        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        // Delete associated files from storage
        const storage = this.firebaseService.getStorage();
        const bucketName = this.firebaseService.getBucketName();
        const bucket = storage.bucket(bucketName);
        // Use the new folder structure: customers/{customerId}/
        const [files] = await bucket.getFiles({ prefix: `customers/${id}/` });
        await Promise.all(files.map(file => file.delete()));
        await docRef.delete();
        return { id };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = CustomersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], CustomersService);
