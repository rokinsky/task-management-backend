import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    const salt = await bcrypt.genSalt();

    user.username = username;
    user.password = await bcrypt.hash(password, salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        // duplicated username
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
