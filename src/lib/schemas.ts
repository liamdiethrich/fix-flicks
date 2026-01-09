import { z } from "zod";

export const RoomEnum = z.enum([
  "kitchen",
  "bathroom",
  "desk",
  "closet",
  "laundry",
  "living",
  "pets",
  "entryway",
  "other",
]);

export const DifficultyEnum = z.enum(["easy", "medium", "hard"]);

export const FixSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  room: RoomEnum,
  tags: z.array(z.string().min(1)),
  renterSafe: z.boolean(),
  noDrill: z.boolean(),
  timeMinutes: z.number().int().positive(),
  difficulty: DifficultyEnum,
  heroVideo: z.object({
    src: z.string().min(1),
    poster: z.string().optional(),
    durationSeconds: z.number().int().positive().optional(),
  }),
  fitCheck: z
    .array(
      z.object({
        question: z.string().min(1),
        recommendedIfYes: z.boolean().optional(),
      })
    )
    .min(3)
    .max(6),
  kit: z
    .array(
      z.object({
        asin: z.string().length(10),
        name: z.string().min(1),
        why: z.string().min(1),
        quantity: z.number().int().positive(),
        isPlaceholder: z.boolean().optional(),
      })
    )
    .min(3)
    .max(8),
  steps: z.array(z.string().min(1)).min(3).max(7),
  mistakes: z.array(z.string().min(1)).max(5),
  faqs: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).max(8),
  updatedAt: z.string().datetime(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

export type Fix = z.infer<typeof FixSchema>;

export const PlanSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  audienceTags: z.array(z.string().min(1)),
  fixSlugs: z.array(z.string().min(1)),
  checklist: z.array(
    z.object({
      label: z.string().min(1),
      fixSlug: z.string().min(1).optional(),
    })
  ),
  updatedAt: z.string().datetime(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

export type Plan = z.infer<typeof PlanSchema>;
