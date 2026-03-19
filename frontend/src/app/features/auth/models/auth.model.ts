export interface LoginDto {
  email: string;
  password?: string;
  code: string;
}

export interface SignUpDto {
  name: string;
  email: string;
  password?: string;
  role?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  password?: string;
}

export interface ResendOtpDto {
  email: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}
