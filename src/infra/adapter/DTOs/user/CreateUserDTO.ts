import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ValidatableAdapter } from '../../../../core/common/persistance/ValidatableAdapter';
import { ICreateUserDTO } from '../../../../core/domain/user/abstract/DTOs/ICreateUserDTO';

@Exclude()
export class CreateUserDTO extends ValidatableAdapter implements ICreateUserDTO {

    @Expose()
    birthDate!: Date;

    @Expose()
    @IsString()
    passwordHash!: string;

    @Expose()
    @IsString()
    public firstName!: string;

    @Expose()
    @IsString()
    public lastName!: string;

    @Expose()
    @IsEmail()
    public email!: string;

    @Expose()
    @IsNumber()
    public role!: number;

    public static async new(payload: ICreateUserDTO): Promise<CreateUserDTO> {
        const adapter: CreateUserDTO = plainToInstance(CreateUserDTO, payload);
        await adapter.validate();

        return adapter;
    }

}