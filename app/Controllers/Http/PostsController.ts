import Application from '@ioc:Adonis/Core/Application'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
  // // indexing
  // public async index({}: HttpContextContract){

  // }
  
  // create
  public async create({ view }: HttpContextContract){
    return view.render('posts/create')
  }
  // storing
  public async store({ request, auth, response }:HttpContextContract){
    const req = await request.validate({
      schema:schema.create({
        caption: schema.string({}),
        image: schema.file({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg']
        })
     }),
    //  send when input blank
     messages: {
      'caption.required': 'required for uploading new posts',
      'image.required': 'required for uploading new posts',
    }
  })
      const imageName = new Date().getTime().toString() + `.${req.image.extname}`
      await req.image.move(Application.publicPath('images'), {
        name: imageName
      })
      const post = new Post()
      post.image = `images/${imageName}`
      post.caption = req.caption
      post.userId = auth.user!.id
      post.save()
      return response.redirect(`/${auth.user!.username}`) 
  }
  // // show
  // public async show({}:HttpContextContract){

  // }
  // // edit 
  // public async edit({}:HttpContextContract){

  // }
  // // update
  // public async update({}:HttpContextContract){

  // } 
  // // destroy or delete  
  // public async destroy({}:HttpContextContract){

  // }                          
}