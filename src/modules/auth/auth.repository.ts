export abstract class AuthRepository {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  abstract findByEmail(email: string): Promise<any | null>
  abstract create(email: string): Promise<boolean>
}
