/**
 * Represents the payload required for user authentication.
 * Maps strictly to the backend `AuthenticationRequest` DTO.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Represents the response received from the backend upon successful authentication.
 * Maps strictly to the backend `AuthenticationResponse` DTO.
 */
export interface AuthResponse {
  /**
   * JWT used for authorizing subsequent API requests.
   * This token should be included in the 'Authorization' header as 'Bearer <token>'.
   */
  token: string;
}
