import { z } from 'zod';

export const ErrThemeName = new Error('Theme name must be filled');
export const ErrThemeDifficulty = new Error(
  'Theme difficulty must be between 1 and 5',
);

export const ThemeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  sceneUrl: z.string().optional(),
  skyboxUrl: z.string().optional(),
  difficulty: z.number().min(1).max(5),
  isLocked: z.boolean().default(false),
  requiredThemeId: z.number().optional(),
});

export type ThemeCreate = z.infer<typeof ThemeSchema>;
