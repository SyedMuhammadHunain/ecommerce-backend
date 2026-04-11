import { UserService } from '../services/user.service';
import { User } from '../models/user.schema';
import { Request } from 'express';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    becomeSeller(req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getCustomers(): Promise<User[]>;
    getSellers(): Promise<User[]>;
    deleteUser(id: string): Promise<any>;
}
