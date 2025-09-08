import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controller';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),

        PassportModule.register({ defaultStrategy: 'jwt' }),

        JwtModule.register({
          secret: 'mi-secreto',
          signOptions: {
            expiresIn: '2h',
          },
        }),

        AppModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtStrategy,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();
  });

  beforeEach(() => {
    module.close();
  });

  it('Should be defne', () => {
    expect(module).toBeDefined();
  });

  it('Should have AuthService as provider', () => {
    const authService = module.get<AuthService>(AuthService);

    expect(authService).toBeDefined();
  });

  it('Should have AuthController as controller', () => {
    const authController = module.get<AuthController>(AuthController);

    expect(authController).toBeDefined();
  });

  it('Should have PassportModule as provider', () => {
    const passport = module.get<PassportModule>(PassportModule);

    expect(passport).toBeDefined();
  });
});
