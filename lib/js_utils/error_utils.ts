export const ErrorUtils = {
  isError: (err: unknown): err is Error => {
    return err instanceof Error;
  },
};
