import axiosClient from "./axiosClient"

export type ChangePasswordRequest = {
  oldPassword: string
  password: string
  matchingPassword: string
}

export const userApi = {
  changePassword: (data: ChangePasswordRequest) =>
    axiosClient.patch<void>("/api/users/me/password", data),
}