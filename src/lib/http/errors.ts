export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly publicMessage: string,
    public readonly status: number,
  ) {
    super(publicMessage);
    this.name = "AppError";
  }
}
