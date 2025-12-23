import { Response } from "express";

export interface ErrorMessage extends Error {
  status?: number;
}

export const TryError = (
  message: string,
  status: number = 500
): ErrorMessage => {
  console.log("[ERROR] Creating error - Status:", status, "Message:", message);
  const err = new Error(message) as ErrorMessage;
  err.status = status;
  return err;
};

export const CatchError = (
  err: unknown,
  res: Response,
  prodMessage: string = "Internal server error"
) => {
  console.log("[ERROR] Handling error:", err);
  let status = 500;
  let message = prodMessage;

  if (err instanceof Error) {
    status = (err as ErrorMessage).status ?? 500;

    if (process.env.NODE_ENV === "dev") {
      message = err.message;
    }
  }

  console.log("[ERROR] Sending error response - Status:", status, "Message:", message);
  return res.status(status).json({ message });
};
