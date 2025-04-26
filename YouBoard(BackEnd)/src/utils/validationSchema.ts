import * as z from "zod";

// zod schemas for validation
const validationSchema = z.object({
  password: z
    .string()
    .trim()
    .nonempty("Password is required.")
    .min(8, "Password minimum length is 8.")
    .max(30, "Password maximum length is 30.")
    .regex(/^\S*$/, "Password can't contain spaces.")
    .regex(/\d/, "Password must contain a number.")
    .regex(/[^\w\s]/, "Password must contain a special character.")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z]).*$/,
      "Password must include both uppercase and lowercase."
    ),

  name: z
    .string()
    .trim()
    .nonempty("Name is required.")
    .regex(/^((?!\s{2,}).)*$/, "Name can't contain consecutive spaces.")
    .regex(/^\D*$/, "Name can't contain numbers.")
    .regex(/^[a-zA-Z0-9 ]*$/, "Name can't contain special characters.")
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => val.length >= 3, {
      message: "Name minimum length is 3.",
    })
    .refine((val) => val.length <= 16, {
      message: "Name maximum length is 16.",
    }),
});

export default validationSchema;
