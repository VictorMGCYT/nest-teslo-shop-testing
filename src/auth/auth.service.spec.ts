import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto';
import { ValidRoles } from './interfaces';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('Should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('Should create an User', async () => {
    const dto: CreateUserDto = {
      fullName: 'Victor Manuel',
      email: 'victor@gmail.com',
      password: 'Victor2003',
    };

    const user: User = {
      id: '123',
      roles: [ValidRoles.admin],
      isActive: true,
      ...dto,
    } as User;

    jest.spyOn(userRepository, 'create').mockReturnValue(user);
    jest.spyOn(bcrypt, 'hashSync').mockReturnValue('contrasena-super-hash');

    const result = await authService.create(dto);

    expect(bcrypt.hashSync).toHaveBeenCalledWith(dto.password, 10);
    expect(result).toEqual({
      user: {
        id: '123',
        roles: ['admin'],
        isActive: true,
        fullName: 'Victor Manuel',
        email: 'victor@gmail.com',
      },
      token: 'mock-jwt-token',
    });
  });

  // method
  it('Should throw an BadRequestException error if email already exist', async () => {
    const dto: CreateUserDto = {
      fullName: 'Victor Manuel',
      email: 'victor@gmail.com',
      password: 'Victor2003',
    };

    jest.spyOn(userRepository, 'save').mockRejectedValue({
      code: '23505',
      detail: `User with email ${dto.email} already exist`,
    });

    await expect(authService.create(dto)).rejects.toThrow(BadRequestException);
  });
});
