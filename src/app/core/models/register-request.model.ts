/**
 * Represents the data payload required to register a new user account.
 * This structure matches the expected request body for the backend registration endpoint.
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
