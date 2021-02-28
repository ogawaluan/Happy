import { Request, Response } from "express";
import { getCustomRepository, Repository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import UsersRepository from "../repositories/UsersRepository";

class UsersController {
  async register(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExist = await usersRepository.findOne({
      where: { email },
    });

    if (userAlreadyExist) {
      return response.status(400).json({ error: "User already exist!" });
    }

    const hashedPassword = await hash(password, 8); 

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    
    await usersRepository.save(user);

    //@ts-ignore
    delete user.password;
    
    return response.status(201).json(user);
  };

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      return response.status(400).json({ error: "Incorrect email/password combination" });
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      return response.status(400).json({ error: "Incorrect email/password combination" });
    }

    //@ts-ignore
    delete user.password;

    return response.status(201).json({ user });
  }
}

export default UsersController;