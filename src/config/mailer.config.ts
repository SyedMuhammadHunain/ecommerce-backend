import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // MailerModule for sending emails
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.APP_PASSWORD,
        },
      },
      defaults: {
        from: `"ecommerce-backend" <${process.env.EMAIL_USER}>`,
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailerConfig {}
