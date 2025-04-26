import { ZodType, z } from "zod";
import validationSchema from "../utils/validationSchema";

// function to get the correct schema based on current step
const getSchemaByStep = (step: number): ZodType => {
  switch (step) {
    case 1:
      return validationSchema.pick({ email: true });
    case 2:
      return validationSchema.pick({ password: true });
    case 3:
      return validationSchema.pick({ password: true });
    case 4:
      return validationSchema.pick({ name: true });
    default:
      return z.object({});
  }
};

export default getSchemaByStep;
