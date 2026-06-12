import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './DTO/login.dto';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        designation: user.designation,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await this.usersService.updateResetToken(
      user.id,
      resetToken,
      resetTokenExpiry,
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;


    // TODO: Send email
    await this.mailService.sendResetPasswordEmail(
      user.email,
      resetLink,
    );

    return {
      message: 'Password reset link has been sent to your email',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Find user by reset token
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    // Check if token has expired
    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token fields
    await this.usersService.updatePassword(user.id, hashedPassword);

    return {
      message: 'Password has been reset successfully',
    };
  }

  async googleLogin(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException();

      const { sub, email, name, picture } = payload;

      // ✅ Find user by email
      let user = await this.usersService.findByEmail(email);

      // ✅ If not exists → create user
      if (!user) {
        user = await this.usersService.createGoogleUser({
          email,
          name,
          picture,
          googleId: sub,
        });
      }

      const jwtPayload = {
        id: user.id, // UUID from DB
        email: user.email,
      };

      return {
        message: 'Google login successful',
        token: this.jwtService.sign(jwtPayload),
        user,
      };
    } catch (err) {
      console.error("Google login error:", err);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

}
