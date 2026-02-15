import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.REFRESH_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.REFRESH_JWT_EXPIRES_IN as any,
      },
    }),
  ],
  exports: [JwtModule],
})
export class RefreshConfig { }
