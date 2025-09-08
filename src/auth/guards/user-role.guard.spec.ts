import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from './user-role.guard';
import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ValidRoles } from '../interfaces';

describe('UserRoleGuard', () => {
  let guard: UserRoleGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new UserRoleGuard(reflector);

    mockContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    } as unknown as ExecutionContext;
  });

  it('Should return true if not roles are required', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => null);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('Should return true if not roles are empty', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => []);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('Should throw a BadRequestException if user not found', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => [ValidRoles.admin]);
    jest.spyOn(mockContext.switchToHttp(), 'getRequest').mockReturnValue({});

    expect(() => guard.canActivate(mockContext)).toThrow(BadRequestException);
  });

  it('should return true if user has a valid role', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => [ValidRoles.admin]);
    jest.spyOn(mockContext.switchToHttp(), 'getRequest').mockReturnValue({
      user: {
        roles: [ValidRoles.admin],
      },
    });

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should return trow a ForbiddenException if user lacks a valid role', () => {
    jest.spyOn(reflector, 'get').mockImplementation(() => [ValidRoles.admin]);
    jest.spyOn(mockContext.switchToHttp(), 'getRequest').mockReturnValue({
      user: {
        roles: [ValidRoles.user],
      },
    });

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });
});
