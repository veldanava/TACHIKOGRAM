import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  // signup controller
  public async signup({request, response}:HttpContextContract){
    const req = await request.validate({
      schema:schema.create({
        name: schema.string(),
        email: schema.string({}, [
          rules.email()
      ]),
        username: schema.string({}),
        password: schema.string({}),
    }),
    // input when blank message
    messages: {
      'name.required': 'required for signup',
      'email.required': 'required for signup',
      'username.required': 'required for signup',
      'password.required':'required for signup',
    }
  })
     
    const user = new User()
    user.name = req.name
    user.email = req.email
    user.username = req.username
    user.password = req.password
    await user.save();

    // send & resend email verification
    // catch w/ mailtrap
    user?.sendVerificationEmail()

    return response.redirect('/')
  }

  // login controller
  public async login({ request, auth, response }:HttpContextContract){
    const req = await request.validate({
      schema:schema.create({
      email: schema.string({}, [
        rules.email()
      ]),
      password: schema.string({}, [
        rules.minLength(8)
      ])
     }),
    //  send when input blank
     messages: {
      'email.required': 'required for signup',
      'password.required':'required for signup',
      'password.minLength': 'must be 8 character'
    }
  })

  // const user = await User.findByOrFail('email', req.email)
  const email = req.email
  const password = req.password
  const user = await auth.attempt(email, password)

  // redirect to profile route
  return response.redirect(`/${user.username}`)
  }

  // logout controller 
  public async logout({ auth, response }:HttpContextContract){
    await auth.logout()
    return response.redirect('/profile')
  }
}
