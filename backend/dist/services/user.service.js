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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const common_2 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const roles_enums_1 = require("../enums/roles.enums");
let UserService = class UserService {
    userModel;
    authService;
    constructor(userModel, authService) {
        this.userModel = userModel;
        this.authService = authService;
    }
    async findByEmail(email) {
        return await this.userModel.findOne({ email }).lean().exec();
    }
    async createUser(signUpDto) {
        const { name, email, password } = signUpDto;
        const existingUser = await this.userModel.findOne({ email }).lean().exec();
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({
            name,
            email,
            password: hashedPassword,
            role: roles_enums_1.Roles.CUSTOMER,
        });
        common_2.Logger.log(`User with name: ${name} and email: ${email} has signed up successfully`);
        return await user.save();
    }
    async becomeSeller(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role === roles_enums_1.Roles.SELLER) {
            throw new common_1.ConflictException('You are already a seller');
        }
        user.role = roles_enums_1.Roles.SELLER;
        await user.save();
        const aT = await this.authService.generateToken(user);
        const rT = await this.authService.generateRefreshToken(user);
        return {
            accessToken: aT,
            refreshToken: rT,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        auth_service_1.AuthService])
], UserService);
//# sourceMappingURL=user.service.js.map