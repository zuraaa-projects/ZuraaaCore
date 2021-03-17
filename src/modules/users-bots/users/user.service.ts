import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import DiscordUser from 'src/extension-modules/discord/interfaces/DiscordUser'
import { RoleLevel } from 'src/modules/auth/jwt.payload'
import { AvatarService } from 'src/modules/avatars/avatar.service'
import { updateDiscordData } from 'src/utils/discord-update-data'
import UserDto from './dtos/edit-user/user.dto'
import UpdateUserDto from './dtos/update-user/update-user.dto'
import { User, UserDocument } from './schemas/User.schema'

@Injectable()
export class UserService {
  constructor (
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly discordService: DiscordBotService,
    private readonly avatarService: AvatarService
  ) { }

  async create (user: User): Promise<UserDocument> {
    const userCreated = new this.UserModel(user)
    return await userCreated.save()
  }

  async register (id: string): Promise<User> {
    let user = await this.UserModel.findOne({
      _id: id
    }).exec()

    if (user === null) {
      user = new this.UserModel({
        _id: id
      })
    }

    return await updateDiscordData(user, this.discordService, this.avatarService) as User
  }

  async show (id: string): Promise<User | undefined> {
    const result = await this.UserModel.findOne({
      $or: [
        {
          _id: id
        },
        {
          'details.customURL': id
        }
      ]
    }).exec()
    if (result === null) {
      return
    }
    return await updateDiscordData(result, this.discordService, this.avatarService)
  }

  async login (user: DiscordUser): Promise<User> {
    const findUser = await this.UserModel.findById(user.id).exec()
    if (findUser !== null) {
      return new User(await updateDiscordData(findUser, user, this.avatarService), true, true)
    }

    const userData = new this.UserModel({
      _id: user.id
    })

    return await updateDiscordData(userData, user, this.avatarService) as User
  }

  async updateMe (user: UserDto, id: string): Promise<User | undefined> {
    const userDb = await this.UserModel.findById(id).exec()
    if (userDb === null) {
      return
    }
    const discordUserDb = await updateDiscordData(userDb, this.discordService, this.avatarService)
    if (discordUserDb === undefined) {
      return
    }
    discordUserDb.details.description = user.bio ?? null
    return await discordUserDb.save()
  }

  async update (user: User, userUpdate: UpdateUserDto, author: User): Promise<User> {
    if (userUpdate.details !== undefined) {
      if (userUpdate.details.role !== undefined) {
        user.details.role = userUpdate.details.role
      }
    }

    if (userUpdate.banned !== undefined) {
      user.banned = userUpdate.banned
      if (user.banned) {
        user.details.role = RoleLevel.user
        try {
          await this.discordService.banUser(user, author, userUpdate.banReason)
        } catch (error) {

        }
      } else {
        try {
          await this.discordService.unbanUser(user, author)
        } catch (error) {

        }
      }
    }

    await this.UserModel.updateOne({
      _id: user._id
    }, user).exec()

    return user
  }

  async updateNextVote (now: Date, userId: string): Promise<User> {
    const user = await this.UserModel.findById(userId)
    if (user === null) {
      throw new Error('Fail to get user')
    }
    now.setHours(now.getHours() + 8)
    user.dates.nextVote = now
    return await user.save()
  }

  async findById (id: string): Promise<User> {
    return await this.UserModel.findById(id).exec() as User
  }
}
