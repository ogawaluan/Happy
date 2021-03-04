import { Request, Response } from "express";
import { getCustomRepository } from 'typeorm';
import { addHours, isAfter } from 'date-fns';
import { hash } from 'bcryptjs';
import path from 'path';

import UsersRepository from "../repositories/UsersRepository";
import UsersTokenRepository from "../repositories/UsersTokenRepository";
import SendMailService from '../services/SendMailService';
import AppError from "../errors/AppError";

class UpdatePasswordController {
  async sendForgotPasswordEmail(request: Request, response: Response) {
    const { email } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const usersTokenRepository = getCustomRepository(UsersTokenRepository);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const { token } = await usersTokenRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'emails', 'forgotPassword.hbs');

    const subject = 'Recuperação de Senha';

    const variables = {
      name: user.name,
      link: `http://localhost:3000/reset-password?token=${token}`,
    };

    await SendMailService.execute(email, subject, variables, forgotPasswordTemplate);

    return response.status(204).json();
  }

  async updatePassword(request: Request, response: Response) {
    const { token, password } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const usersTokenRepository = getCustomRepository(UsersTokenRepository);

    const usersToken = await usersTokenRepository.findByToken(token);

    if (!usersToken) {
      throw new AppError('User token does not exist.');
    }

    const user = await usersRepository.findById(usersToken.user_id);

    if (!user) {
      throw new AppError('User does not exist.');
    }

    const tokenCreatedAt = usersToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expire');
    }

    const hashNewPassword = await hash(password, 8);

    user.password = hashNewPassword;

    await usersRepository.save(user);

    return response.status(204).json();
  }
}

export default UpdatePasswordController;