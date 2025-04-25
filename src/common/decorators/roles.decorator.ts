import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/*
i.  ROLES_KEY will contain the roles i.e admin, seller or customer.
ii. SetMetadata(ROLES_KEY, roles) will set the ROLES_KEY or metadata to the roles i.e it can be admin, seller or customer.
iii. ...roles: string[] will take the roles and set it to the ROLES_KEY.
iv. here ... will take an array of roles and convert them into an array of roles and set it to the ROLES_KEY.
*/
