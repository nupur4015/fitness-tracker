import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }

    async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
        const { email, name, password, role, phone } = signUpDto;
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const existingRole = await this.prisma.role.findFirst({
            where: {
                name: role
            }
        });

        if (!existingRole) {
            throw new BadRequestException("Role doesn't exist");
        }

        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                phone,
                role: {
                    connect: {
                        id: existingRole.id
                    }
                }
            },
        });

        const payload = { sub: user.id, username: user.email, role: role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
        const { email, password } = signInDto;

        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
            include: {
                role: true
            }
        });

        if (!user) {
            throw new BadRequestException("User doesn't exist");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = { sub: user.id, username: user.email, role: user.role.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
