import { UserUpdate, userUpdateSchema } from '../../../common/schemas';
import { ZodValidationPipe } from '../../../common/pipes';

export class UpdateUserDto implements Partial<UserUpdate> {
  email?: string;
  name?: string;
  password?: string;
}

export const UpdateUserValidationPipe = new ZodValidationPipe(userUpdateSchema);
