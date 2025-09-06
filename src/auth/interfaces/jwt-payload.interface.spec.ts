import { JwtPayload } from "./jwt-payload.interface";

describe('JWT Payload Interface', () => {

    it('Should return true for a valid payload', () => {
        const validPayload: JwtPayload = {id: "123"}

        expect(validPayload.id).toBe('123');
    });

});