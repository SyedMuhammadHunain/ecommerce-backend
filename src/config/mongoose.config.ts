import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserSchema } from '../models/user.schema';
import { Module } from '@nestjs/common';
import { AuthSchema } from '../models/auth.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // MongooseModule for connecting to MongoDB
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'AuthCollections', schema: AuthSchema },
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [MongooseModule],
})
export class MongooseConfig {}
