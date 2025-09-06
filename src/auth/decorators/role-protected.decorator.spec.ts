import { SetMetadata } from "@nestjs/common";
import { ValidRoles } from "../interfaces";
import { META_ROLES, RoleProtected } from "./role-protected.decorator";

jest.mock('@nestjs/common', () => ({
    // SetMetadata: jest.fn().mockImplementation( (key, values) => ({
    //     key,
    //     values
    // }))
    SetMetadata: jest.fn()
}));

describe('RoleProtectedDecorator', () => {

    it('Should set metadata with correct roles', () => {

        const roles = [ValidRoles.admin, ValidRoles.user];

        const result = RoleProtected(...roles);

        expect(SetMetadata).toHaveBeenCalledTimes(1);
        expect(SetMetadata).toHaveBeenCalledWith(META_ROLES, roles)
        // expect(result).toEqual({
        //     key: META_ROLES,
        //     values: roles
        // })
    });

});