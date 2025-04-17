import { z } from 'zod';

export const ErrEmailInvalid = new Error('Invalid email format');
export const ErrNameAtLeast2Chars = new Error(
  'Name must be at least 2 characters',
);
export const ErrPasswordAtLeast8Chars = new Error(
  'Password must be at least 8 characters',
);
export const ErrPasswordAtLeastOneUppercase = new Error(
  'Password must contain at least one uppercase letter',
);
export const ErrPasswordAtLeastOneLowercase = new Error(
  'Password must contain at least one lowercase letter',
);
export const ErrPasswordAtLeastOneNumber = new Error(
  'Password must contain at least one number',
);
export const ErrPasswordRequired = new Error('Password is required');

export const userCreateSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email({ message: ErrEmailInvalid.message }),
  name: z.string().min(2, { message: ErrNameAtLeast2Chars.message }).optional(),
  password: z
    .string()
    .min(8, { message: ErrPasswordAtLeast8Chars.message })
    .regex(/[A-Z]/, {
      message: ErrPasswordAtLeastOneUppercase.message,
    })
    .regex(/[a-z]/, {
      message: ErrPasswordAtLeastOneLowercase.message,
    })
    .regex(/[0-9]/, { message: ErrPasswordAtLeastOneNumber.message }),
  role: z.enum(['user', 'admin']).optional(),
});

export const userUpdateSchema = userCreateSchema.partial().omit({ role: true });

export const userLoginSchema = z.object({
  email: z.string().email({ message: ErrEmailInvalid.message }),
  password: z.string().min(1, { message: ErrPasswordRequired.message }),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
