import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { getUser } from './get-user.decorator';

jest.mock('@nestjs/common', () => {
  return {
    createParamDecorator: jest.fn(),
    InternalServerErrorException:
      jest.requireActual('@nestjs/common').InternalServerErrorException,
  };
});

describe('GetUserDecorator', () => {
  const mockExcecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: {
          id: 'eliddelusuario',
          email: 'victor@gmail.com',
          password: 'Victor2003',
          fullName: 'Victor Manuel',
          isActive: true,
          roles: ['user', 'super'],
        },
      }),
    }),
  } as unknown as ExecutionContext;

  it('Should return user, without data', () => {
    const user = getUser(null, mockExcecutionContext);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('fullName');
    expect(user).toHaveProperty('isActive');
    expect(user).toHaveProperty('roles');
    expect(user.data).toBeUndefined();
  });

  it('Should return user, with data', () => {
    const email = getUser('email', mockExcecutionContext);

    expect(email).toBe('victor@gmail.com');
  });

  it('Should throw an InternalServerErrorException if user not found', () => {
    // ! Aquí estamos haciendo un shadowing en JS/TS para opacar la variable del describe
    const mockExcecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: null,
        }),
      }),
    } as unknown as ExecutionContext;

    try {
      getUser(null, mockExcecutionContext);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('Should return param decorator with user', () => {
    expect(createParamDecorator).toHaveBeenCalledWith(getUser);
  });
});
