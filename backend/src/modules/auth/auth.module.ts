import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UsersModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // ✅ important
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule { }
