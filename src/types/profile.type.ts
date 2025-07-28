export interface UpdatePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileData {
  userId: string;
  username: string;
  email: string;
  nama_usaha: string;
}

export interface ProfileResponse {
  message: string;
  data?: object;
}
