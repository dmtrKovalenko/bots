export class CustomError extends Error {
  constructor(message: string, public stacktrace?: any) {
    super(message);
  }
}
