import { instanceToPlain } from "class-transformer";
import { CreateUserDto } from "./create-user.dto";
import { validate } from "class-validator";
import "reflect-metadata";


describe('CreateUserDto', () => {

    it('Should create user with correct properties', async () => {
        const dto = new CreateUserDto();
        dto.email = 'victor@gmail.com';
        dto.fullName = 'Víctor';
        dto.password = 'Victor2003';

        const errors = await validate(dto);

        expect(errors.length).toBe(0);
        expect(errors).toBeInstanceOf(Array);
    });

    it('Should throw an error if password is not valid', async () => {
        const dto = new CreateUserDto();
        dto.email = 'victor@gmail.com';
        dto.fullName = 'Víctor';
        dto.password = 'victor2003';

        const errors = await validate(dto);
        const passwordError = errors.find(error => error.property === 'password')

        expect(passwordError).toBeDefined();
        expect(passwordError.constraints).toBeDefined();
        
    });

});