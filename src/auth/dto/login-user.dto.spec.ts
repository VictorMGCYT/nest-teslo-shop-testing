import "reflect-metadata"
import { LoginUserDto } from "./login-user.dto";
import { validate } from "class-validator";

describe('LoginUserDto', () => {

    it('Should create a login with correct data', async () => {
        const dto = new LoginUserDto();
        dto.email = 'victor@gmail.com';
        dto.password = 'Victro2003';

        const errors = await validate(dto);

        expect(errors.length).toBe(0);
    });

    it('Should throw an error with invalid data', async () => {
        const dto = new LoginUserDto();
        dto.email = 'victor.gmail.com';
        dto.password = 'victro2003';

        const errors = await validate(dto);
        const errorEmail = errors.find( error => error.property === 'email');
        const errorPass = errors.find( error => error.property === 'password');

        expect(errorEmail).toBeDefined();
        expect(errorPass).toBeDefined();
    });

});