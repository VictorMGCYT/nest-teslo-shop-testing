import { plainToClass } from "class-transformer";
import { PaginationDto } from "./pagination.dto";
import { validate } from "class-validator";


describe('PaginationDTO', () => {

    it('Should work with default parameters', async () => {
        // son todos opcionales asi que lo mandamos vacío
        const dto = plainToClass(PaginationDto, {})

        const errors = await validate(dto);
        
        expect(errors.length).toBe(0);
    });

    it('Should allow optional gender field with valid values', async () => {
        const validValues = ['men', 'women', 'unisex', 'kid'];
        
        validValues.forEach( async (gender) => {
            const dto = plainToClass(PaginationDto, {gender: gender})
            const errors = await validate(dto);

            expect(errors.length).toBe(0);
        })
    });

});