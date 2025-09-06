import { ValidRoles } from "./valid-roles";

describe(`Valid roles Enum`, () => {

    it('Should have correct values', () => {

        expect(ValidRoles.admin).toBe(`admin`);
        expect(ValidRoles.superUser).toBe(`super-user`);
        expect(ValidRoles.user).toBe(`user`);

    });

    it('Should have a correct values', () => {
        const values = ['admin', 'super-user', 'user'];

        expect(Object.values(ValidRoles)).toEqual(
            expect.arrayContaining(values)
        )
    });

});