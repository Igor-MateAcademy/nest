import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'

import { AuthResponseDTO } from './dto/auth-response.dto'
import { LoginDto } from './dto/login.dto'
import { SignUpDto } from './dto/sign-up.dto'

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto): Promise<AuthResponseDTO> {
    return this.authService.signUp(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<AuthResponseDTO> {
    return this.authService.login(dto)
  }
}
