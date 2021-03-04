import { EntityRepository, Repository } from "typeorm";

import User from "../models/User";

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  public async findById(id: string): Promise<User | undefined> {
    const user = await this.findOne(id);

    return user;
  }
}

export default UsersRepository;