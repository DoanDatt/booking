// Dữ liệu mình đưa vào khi ký
export interface AccessTokenPayloadCreate {
  userId: number
  deviceId: number
  roleId: number
  roleName: string
}

// Dữ liệu nhận lại khi verify: thư viện tự thêm exp (hết hạn) và iat (thời điểm ký)
export interface AccessTokenPayload extends AccessTokenPayloadCreate {
  exp: number
  iat: number
}

export interface RefreshTokenPayloadCreate {
  userId: number
}

export interface RefreshTokenPayload extends RefreshTokenPayloadCreate {
  exp: number
  iat: number
}
