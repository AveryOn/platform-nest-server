import type {
  ApiKeyServiceCmd,
  ApiKeyServiceRes,
} from '~/modules/api-key/application/api-key.type'

export const API_KEY_SERVICE_PORT = Symbol('API_KEY_SERVICE_PORT')

export abstract class ApiKeyServicePort {
  abstract create(
    cmd: ApiKeyServiceCmd.Create,
  ): Promise<ApiKeyServiceRes.Create>

  abstract getList(
    cmd: ApiKeyServiceCmd.GetList,
  ): Promise<ApiKeyServiceRes.GetList>

  abstract getById(
    cmd: ApiKeyServiceCmd.GetById,
  ): Promise<ApiKeyServiceRes.GetById>

  abstract revoke(
    cmd: ApiKeyServiceCmd.Revoke,
  ): Promise<ApiKeyServiceRes.Revoke>
}
