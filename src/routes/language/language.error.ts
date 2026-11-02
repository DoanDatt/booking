import { UnprocessableEntityException } from '@nestjs/common'

// UnprocessableEntityException: tạo object lỗi 422. Tham số truyền vào sẽ thành field message trong response
// path: 'id' là lỗi thuộc field id trong body. Frontend nhờ đó biết phải hiện lỗi dưới ô nào
export const LanguageAlreadyExistsException = () =>
  new UnprocessableEntityException([
    {
      message: 'Error.LanguageAlreadyExists',
      path: 'id',
    },
  ])
