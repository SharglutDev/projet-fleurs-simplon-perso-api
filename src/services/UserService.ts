import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export const userRepository = AppDataSource.getRepository(User);

export class UserService {
  async signUpNewUser(newUser: User): Promise<User> {
    return await userRepository.save(User.create(newUser));
  }

  async logInUser(connectingUserEmail: string): Promise<User | null> {
    return await userRepository.findOne({
      where: {
        email: connectingUserEmail,
      },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await userRepository.find();
  }

  async getOneUser(payload: any): Promise<User | null> {
    return await userRepository.findOne({
      where: {
        id: payload.sub,
      },
    });
  }

  async deleteOneUser(userId: string): Promise<User | undefined> {
    const userToRemove = await userRepository.findOneBy({
      id: userId,
    });
    if (!userToRemove) return;
    return await userRepository.remove(userToRemove);
  }
}
