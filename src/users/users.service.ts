import { Injectable } from '@nestjs/common';
import { Role } from '../auth/role.enum';

// TODO: create a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  // TODO: store passwords in a secure way
  private readonly users = [
    {
      userId: 1,
      role: Role.User,
      username: 'Jack',
      password: 'password1'
    },
    {
      userId: 2,
      role: Role.Manager,
      username: 'Jared',
      password: 'password2'
    }
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
