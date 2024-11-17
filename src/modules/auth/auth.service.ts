
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }

    async signIn(
        email: string,
        pass: string,
    ): Promise<{ access_token: string }> {

        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
            include: {
                role: true
            }
        })
        if (!user) throw new BadRequestException("user doesn't exist");
        
        //will update logic
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.email, role: user.role.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };


    }
}
