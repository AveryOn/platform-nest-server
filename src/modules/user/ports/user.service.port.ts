import {
  FindUserInput,
  GetUsersInput,
  User,
} from '~/modules/user/application/user.types'
import { PaginatedOutput } from '~/shared/paginator/application/paginator.types'

export const USER_PORT = Symbol('USER_PORT')

export interface UserServicePort {
  find(input: FindUserInput): Promise<User>

  getUsers(input: GetUsersInput): Promise<PaginatedOutput<User>>
}
