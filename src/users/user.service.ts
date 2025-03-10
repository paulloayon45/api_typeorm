import { AppDataSource } from "../_helpers/db";
import { User } from "./user.model";
import * as bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { Role } from "../_helpers/role";

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getById(id: number): Promise<User> {
        return await this.getUser(id);
    }

    async create(params: Partial<User>): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { email: params.email } });
        if (existingUser) {
            throw new Error(`Email "${params.email}" is already registered`);
        }
    
        const user = this.userRepository.create(params);
    
        // Check if password is provided before hashing
        if (params.password) {
            user.passwordHash = await bcrypt.hash(params.password, 10);
        } else {
            throw new Error("Password is required");
        }
    
        user.role = params.role || Role.User;
        await this.userRepository.save(user);
    }    

    async update(id: number, params: Partial<User>): Promise<void> {
        const user = await this.getUser(id);
    
        if (params.role && user.role !== params.role) {
            const roleExists = await this.userRepository.findOne({ where: { role: params.role } });
            if (roleExists) {
                throw new Error(`Role "${params.role}" is already taken`);
            }
        }
    
        // Check and hash the password if it exists
        if (params.password) {
            params.passwordHash = await bcrypt.hash(params.password, 10);
        }
    
        Object.assign(user, params);
        await this.userRepository.save(user);
    }
    

    async delete(id: number): Promise<void> {
        const user = await this.getUser(id);
        await this.userRepository.remove(user);
    }

    private async getUser(id: number): Promise<User> {
        return await this.userRepository.findOneOrFail({ where: { id } });
    }
}
