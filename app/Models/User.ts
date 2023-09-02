import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail'
import Route from '@ioc:Adonis/Core/Route'
// import { nanoid } from 'nanoid'
import Env from '@ioc:Adonis/Core/Env'
import Post from './Post'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string
  
  @column()
  public username: string
  
  @column()
  public avatar: string
  
  @column()
  public details: string

  @column.dateTime()
  public email_verified_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  // for hash
  @beforeSave()
  public static async hashPassword(user: User){
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // send & resend email verification n try catch with mailtrap
  // fixed bug on verify email
  public async sendVerificationEmail(){
    // fixed bug on signed API route
    const url = Env.get('APP_URL') + Route.makeSignedUrl('verifyEmail', { params: { email: this.email }, expiresIn: '30m', })
    Mail.send((message) => {
      message
        .from('admin@tachikogram.space')
        .to(this.email)
        .subject('verify your email')
        .htmlView('emails/verify', { user: this, url })
    })
  }
}
