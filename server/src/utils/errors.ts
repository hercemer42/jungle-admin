import type { Response } from "express";

class QueryError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    err: Error | null = null,
  ) {
    if (!err) {
      err = new Error(message);
    }
    super(message);
    console.error(`QueryError: ${message} (status: ${status}) ${err}`);
  }
}

const handleError = (res: Response, err: Error) => {
  console.error(err);
  const status = err instanceof QueryError ? err.status : 500;
  res.status(status).json({ error: err.message });
};

export { QueryError, handleError };
