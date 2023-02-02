import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Nullable, Optional } from '../../../core/common/commonTypes';
import { IUserRepository } from '../../../core/domain/user/abstract/persistance/IUserRepository';
import { User } from '../../../core/domain/user/entity/user';
import { UserDITokens } from '../../../core/domain/user/userDITokens';
import { HttpJwtPayload, HttpLoggedInUser, HttpUserPayload } from './HttpAuthTypes';

@Injectable()
export class HttpAuthService {

    constructor(
        @Inject(UserDITokens.UserRepository)
        private readonly userRepository: IUserRepository,

        private readonly jwtService: JwtService
    ) { }

    public async validateUser(username: string, password: string): Promise<Nullable<HttpUserPayload>> {
        const user: Optional<User> = await this.userRepository.findUser({ email: username });

        if (user) {
            const isPasswordValid: boolean = await user.comparePasswordHash(password);
            if (isPasswordValid) {
                return { id: user.getId(), email: user.getEmail(), role: user.getRole() ? user.getRole()! : 0 };
            }
        }

        return null;
    }

    public login(user: HttpUserPayload): HttpLoggedInUser {
        const payload: HttpJwtPayload = { id: user.id };
        return {
            id: user.id,
            accessToken: this.jwtService.sign(payload),
        };
    }

    public async getUser(by: { id: string }): Promise<Optional<User>> {
        return this.userRepository.findUser(by);
    }

}