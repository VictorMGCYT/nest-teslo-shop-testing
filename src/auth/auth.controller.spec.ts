import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import * as request from 'supertest';

describe('AuthController Tests', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockeAuthService = {
      create: jest.fn(),
      login: jest.fn(),
      checkAuthStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        {
          provide: AuthService,
          useValue: mockeAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('Should creat a User with the correct DTO', async () => {
    const dto: CreateUserDto = {
      fullName: 'Víctor Manunel',
      email: 'victor@gmail.com',
      password: 'TestUser',
    };

    await authController.createUser(dto);
    expect(authService.create).toHaveBeenCalledWith(dto);
  });

  it('Should call login with correct dto', async () => {
    const dto: LoginUserDto = {
      email: 'victor@gmail.com',
      password: 'TestUser',
    };

    await authController.loginUser(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('Should call status with correct dto', async () => {
    const dto = new User();

    await authController.checkAuthStatus(dto);
    expect(authService.checkAuthStatus).toHaveBeenCalledWith(dto);
  });

  it('Should return private data', () => {
    const user = {
      id: '123',
      email: 'victor@gmail.com',
      fullName: 'Victor',
    } as User;

    const request = {} as Express.Request;

    const rawHeaders = ['Auth', 'Bearer', 'Header 2'];
    const headers = { header1: 'header1', header2: 'header2' };

    const result = authController.testingPrivateRoute(
      request,
      user,
      user.email,
      rawHeaders,
      headers,
    );

    expect(result).toEqual({
      ok: true,
      message: 'Hola Mundo Private',
      user: { id: '123', email: 'victor@gmail.com', fullName: 'Victor' },
      userEmail: 'victor@gmail.com',
      rawHeaders: ['Auth', 'Bearer', 'Header 2'],
      headers: { header1: 'header1', header2: 'header2' },
    });
  });
});
