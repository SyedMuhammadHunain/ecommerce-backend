import { UserService } from '../services/user.service';
import { Request } from 'express';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    becomeSeller(req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
