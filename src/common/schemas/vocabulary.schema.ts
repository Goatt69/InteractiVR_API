import { z } from 'zod';

// Error messages
export const ErrEnglishWordRequired = new Error('English word is required');
export const ErrVietnameseRequired = new Error('Vietnamese translation is required');
export const ErrPronunciationRequired = new Error('Pronunciation is required');
export const ErrObjectIdRequired = new Error('Object ID is required');
export const ErrAudioUrlInvalid = new Error('Audio URL must be a valid URL');
export const ErrExamplesMustBeArray = new Error('Examples must be an array of strings');
export const ErrTargetPositionInvalid = new Error('Target position must be a valid object');

// Base schema
export const vocabularyBaseSchema = z.object({
  englishWord: z
    .string()
    .min(1, { message: ErrEnglishWordRequired.message })
    .transform(word => word.trim()),

  vietnameseTranslation: z
    .string()
    .min(1, { message: ErrVietnameseRequired.message })
    .transform(text => text.trim()),

  pronunciation: z
    .string()
    .min(1, { message: ErrPronunciationRequired.message }),

  audioUrl: z
    .string()
    .url({ message: ErrAudioUrlInvalid.message })
    .optional(),

    examples: z
    .array(z.string())
    .optional(),

  objectId: z
    .number({
      required_error: ErrObjectIdRequired.message,
      invalid_type_error: 'Object ID must be a number'
    }),
});

// Create schema inherits from base
export const vocabularyCreateSchema = vocabularyBaseSchema;

// Update schema - all fields are optional
export const vocabularyUpdateSchema = vocabularyBaseSchema.partial();

// Schema for user vocabulary tracking
export const userVocabularySchema = z.object({
  userId: z.string().uuid(),
  vocabularyId: z.number(),
  learned: z.boolean().default(false),
  lastReviewed: z.date().optional(),
  proficiency: z.number().min(0).max(100).default(0)
});

//export type UserVocabulary = z.infer<typeof userVocabularySchema>;
export type CreateVocabulary = z.infer<typeof vocabularyCreateSchema>;
export type UpdateVocabulary = z.infer<typeof vocabularyUpdateSchema>;
