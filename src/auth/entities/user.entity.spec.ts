import { User } from './user.entity';

describe('UserEntity', () => {
  it('Should create a valid user instance', () => {
    const user = new User();

    expect(user).toBeInstanceOf(User);
  });

  it('Should clear email before save', () => {
    const user = new User();
    user.email = 'Victor@gmail.com   ';

    user.checkFieldsBeforeInsert();

    expect(user.email).toBe('victor@gmail.com');
  });

  it('Should clear email before update', () => {
    const user = new User();
    user.email = 'Victor@gmail.com   ';

    user.checkFieldsBeforeUpdate();

    expect(user.email).toBe('victor@gmail.com');
  });
});
