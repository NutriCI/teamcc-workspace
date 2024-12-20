import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './common/common.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { FoodsModule } from './foods/foods.module';
import { GoogleCloudStorageService } from './common/google-cloud-storage.service';
import { HttpModule } from '@nestjs/axios';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    ProfileModule,
    UserModule,
    FoodsModule,
    HttpModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [GoogleCloudStorageService],
  exports: [GoogleCloudStorageService],
})
export class AppModule {}