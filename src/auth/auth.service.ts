import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'

import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { User } from 'user/schemas/user.schema'

import { AuthResponseDTO } from './dto/auth-response.dto'
import { LoginDto } from './dto/login.dto'
import { SignUpDto } from './dto/sign-up.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthResponseDTO> {
    const { password, ...userData } = dto

    const hashedPassword = await bcrypt.hash(password, 5)
    const user = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    })
    const accessToken = this.jwtService.sign({ id: user.id })

    return { accessToken }
  }

  async login(dto: LoginDto): Promise<AuthResponseDTO> {
    const { email, password } = dto

    const userByCredentials = await this.userModel.findOne({
      email: email,
    })

    if (!userByCredentials) throw new UnauthorizedException('Credentials are wrong')

    const isPasswordMatched = await bcrypt.compare(userByCredentials.password, password)

    if (!isPasswordMatched) throw new UnauthorizedException('Wrong password')

    const accessToken = this.jwtService.sign({ id: userByCredentials._id })

    return { accessToken }
  }
}
