import { EntityRepository, Repository } from 'typeorm';

import UserTokens from '../models/UserTokens';

@EntityRepository(UserTokens)
class UsersTokenRepository extends Repository<UserTokens> {
  public async findByToken(token: string): Promise<UserTokens | undefined> {
    const userToken = await this.findOne({
      where: { token }
    });

    return userToken;
  }
  
  public async generate(user_id: string): Promise<UserTokens> {
    const userToken = this.create({
      user_id,
    });

    await this.save(userToken);

    return userToken;
  }
}

export default UsersTokenRepository;