import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcrypt'

const saltRounds = 10

@Injectable()
export class HashingService {
  hash(value: string) {
    return hash(value, saltRounds)
  }
  // so mật khẩu người dùng nhập với chuỗi đã băm trong DB
  compare(value: string, hash: string) {
    return compare(value, hash)
  }
}
