import { Roles } from '../enums/roles.enums';
import { IsNotEmpty, IsEnum, IsEmail } from 'class-validator';

export class UpdateRoleDto {
  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
