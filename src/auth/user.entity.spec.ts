import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    // @ts-ignore
    bcrypt.compare = jest.fn();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      // @ts-ignore
      bcrypt.compare.mockReturnValue(true);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validatePassword('123455');
      expect(bcrypt.compare).toHaveBeenCalledWith('123455', user.password);
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      // @ts-ignore
      bcrypt.compare.mockReturnValue(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrongPassword');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongPassword',
        user.password,
      );
      expect(result).toEqual(false);
    });
  });
});
