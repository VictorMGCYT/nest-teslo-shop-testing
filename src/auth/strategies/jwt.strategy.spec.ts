import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      findOneBy: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('Should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('Should validate and return user if user exist and is active', async () => {
    const payload: JwtPayload = { id: '123' };
    const mockUser = {
      id: '123',
      isActive: true,
    } as User;

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);

    const result = await strategy.validate(payload);

    expect(result).toEqual(mockUser);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: '123' });
  });

  it('Should throw an UnauthorizedException if user does not exist', async () => {
    const payload: JwtPayload = { id: '123' };

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

    try {
      await strategy.validate(payload);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('Should throw an UnauthorizedException if user is not active', async () => {
    const payload: JwtPayload = { id: '123' };
    const mockUser = {
      id: '123',
      isActive: false,
    } as User;

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);

    try {
      await strategy.validate(payload);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('User is inactive, talk with an admin');
    }
  });
});
