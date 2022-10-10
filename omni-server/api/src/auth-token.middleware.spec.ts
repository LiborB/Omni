import { AuthTokenMiddleware } from './auth-token.middleware';

describe('AuthTokenMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthTokenMiddleware()).toBeDefined();
  });
});
