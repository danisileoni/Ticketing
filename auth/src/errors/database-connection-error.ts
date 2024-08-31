export class DatabaseConnectionError extends Error {
  reason = "Error connection to database error";

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
