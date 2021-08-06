import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>(
          'DBHOST',
        )}/${configService.get<string>('MONGO_URI')}`,
      }),
      inject: [ConfigService],
    }),
    MessageModule,
    AuthModule,
    UserModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
