import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
export declare class AuthGuard implements CanActivate {
    private reflector;
    private jwtService;
    private readonly logger;
    constructor(reflector: Reflector, jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
