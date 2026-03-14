export abstract class AuthRepository {
  abstract findByEmail(email: string): Promise<any | null>
  abstract create(email: string): Promise<boolean>
}
