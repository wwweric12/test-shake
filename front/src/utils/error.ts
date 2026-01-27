interface ExpectedError {
  data?: {
    message?: string;
  };
  message?: string;
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error !== null && typeof error === 'object') {
    const err = error as ExpectedError;

    if (err.data?.message) return err.data.message;
    if (err.message) return err.message;
  }

  return fallback;
};
