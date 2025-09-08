import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRawHeaders } from './raw-headers.decorator';

jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn().mockReturnValue(jest.fn()),
}));

describe('RawHeadersDecorator', () => {
  const mockExecutionContext = {
    // usando mock implementation
    switchToHttp: jest.fn().mockImplementation(() => ({
      // usando mock return value
      getRequest: jest.fn().mockReturnValue({
        rawHeaders: ['Authorization', 'Bearer token'],
      }),
    })),
  } as unknown as ExecutionContext;

  it('should return the raw headers from request', () => {
    const result = getRawHeaders('', mockExecutionContext);

    expect(result).toEqual(['Authorization', 'Bearer token']);
  });

  it('Should call createParamDecorator with getRawHeaders', () => {
    expect(createParamDecorator).toHaveBeenCalledWith(getRawHeaders);
  });
});
