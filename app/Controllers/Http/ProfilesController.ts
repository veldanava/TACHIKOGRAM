import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class ProfilesController {
    public async index( {view, params}:HttpContextContract ){
      const username = params.username
      const user = await User.findBy('username', username)      
      // if username not found
      if(!user){
        return view.render('errors/not-found')
      }
      await user.load('posts')

      // if username found, get back to profile
      return view.render('profile', { user })
  }
  
  public async edit({view}:HttpContextContract){
    return view.render('accounts/edit')
  }
  // profile update
  public async update({auth, request, response}:HttpContextContract){
    const user = auth.user!
    const avatar = request.file('avatar')
    if(avatar){
      // storing
      const imageName = new Date().getTime().toString() + `.${avatar.extname}`
      await avatar.move(Application.publicPath('images'), {
        name: imageName
      })
      user.avatar = `images/${imageName}`
    }
    // details
    user.details = request.input('details')
    await user?.save()
    return response.redirect(`/${user.username}`)
  }
}
