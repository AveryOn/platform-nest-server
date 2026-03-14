import { GetUsersInput, User } from "~/modules/user/application/user.types"
import { PaginatedOutput } from "~/shared/paginator/application/paginator.types"

export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT')

export interface UserRepositoryPort {
    findById(id: string): Promise<User | null>
  
    findByEmail(email: string): Promise<User | null>
  
    findMany(input: GetUsersInput): Promise<PaginatedOutput<User>>
  
    // create(input: CreateUserInput): Promise<User>
  
    // update(id: string, input: UpdateUserInput): Promise<User>
  
    // delete(id: string): Promise<void>
}