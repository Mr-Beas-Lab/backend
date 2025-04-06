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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let CustomersService = class CustomersService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
        this.collection = 'customers';
    }
    async create(createCustomerDto) {
        const firestore = this.firebaseService.getFirestore();
        const docRef = await firestore.collection(this.collection).add(createCustomerDto);
        return { id: docRef.id, ...createCustomerDto };
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
            throw new common_1.NotFoundException('Customer not found');
        }
        return { id: doc.id, ...doc.data() };
    }
    async update(id, updateCustomerDto) {
        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Customer not found');
        }
        // Convert the DTO to a plain object for Firebase update
        const updateData = Object.entries(updateCustomerDto).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});
        await docRef.update(updateData);
        return { id, ...updateData };
    }
    async remove(id) {
        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Customer not found');
        }
        await docRef.delete();
        return { id };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], CustomersService);
