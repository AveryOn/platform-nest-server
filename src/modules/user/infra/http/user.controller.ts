import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common'
import { USER_PORT, type UserServicePort } from '~/modules/user/ports/user.service.port'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { GetUserResponse, UserQueryDto } from '~/modules/user/infra/http/user.dto'
import { ApiDataResponse } from '~/core/interceptors/json-response.interceptor'
import { PaginatedResponse } from '~/shared/paginator/infra/http/paginator.dto'

@ApiTags(ApiSwaggerTag.User)
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(
    @Inject(USER_PORT)
    private userService: UserServicePort,
  ) {}

  @Get('')
  @ApiDataResponse({
    type: GetUserResponse,
    status: HttpStatus.OK,
    description: 'Success',
    paginated: true,
  })
  @ApiOperation({
    summary: 'Get Users (with pagination)',
    description: 'Get users with pagination',
    operationId: 'get_users_list',
    tags: [ApiSwaggerTag.User],
  })
  async getUsers(@Query() query: UserQueryDto): Promise<PaginatedResponse<GetUserResponse>> {
    await this.userService.find({ id: 'abc123' })
    return await this.userService.getUsers(query) as any
  }
}
