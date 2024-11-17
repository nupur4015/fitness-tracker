import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HelmetMiddleware } from './middleware/helmet.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config.constants';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './common/gaurds/roles.gaurd';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

const getConfigModule = () =>
  ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
  });

const getJwtModule = () =>
  JwtModule.registerAsync({
    global: true,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('jwt.accessTokenSecret'),
      signOptions: { expiresIn: configService.get('jwt.accessTokenExpiry') },
    }),
  });

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, getConfigModule(), getJwtModule()
  ],
  controllers: [AppController],
  providers: [AppService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HelmetMiddleware).forRoutes('*');
  }
}
