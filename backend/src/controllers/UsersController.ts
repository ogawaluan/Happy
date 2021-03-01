import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import UsersRepository from "../repositories/UsersRepository";
import authConfig from '../config/auth';
import AppError from "../errors/AppError";

class UsersController {
  async register(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExist = await usersRepository.findOne({
      where: { email },
    });

    if (userAlreadyExist) {
      throw new AppError('User already exist!');
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
      throw new AppError('Incorrect email/password combination');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    //@ts-ignore
    delete user.password;

    return response.status(201).json({ user, token });
  }
}

export default UsersController;