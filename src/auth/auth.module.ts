import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { ConfigService } from '@nestjs/config';
import { TwoFactorService } from './twofactor.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SelfOrAdminGuard } from './guards/self-or-admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UserModule),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow('JWT_EXPIRES'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    AuthService,
    TwoFactorService,
    SelfOrAdminGuard,
    TwoFactorService,
  ],
  exports: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    SelfOrAdminGuard,
    TwoFactorService,
  ],
})
export class AuthModule {}
