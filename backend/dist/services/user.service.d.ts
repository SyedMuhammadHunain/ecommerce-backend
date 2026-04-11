import { User } from '../models/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from '../dtos/signup.dto';
import { AuthService } from './auth.service';
export declare class UserService {
    private userModel;
    private authService;
    constructor(userModel: Model<User>, authService: AuthService);
    findByEmail(email: string): Promise<User | null>;
    createUser(signUpDto: SignUpDto): Promise<User>;
    becomeSeller(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    findAllCustomers(): Promise<User[]>;
    findAllSellers(): Promise<User[]>;
    deleteUser(userId: string): Promise<any>;
}
