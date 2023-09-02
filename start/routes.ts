import Route from '@ioc:Adonis/Core/Route'

// render route
Route.on('/').render('welcome')
Route.on('/signup').render('auth/signup').middleware('guest')
Route.on('/login').render('auth/login').middleware('guest')

// method route
// Route.post('/signup', 'SignUpController.index')

// for post
Route.post('/verify', 'EmailVerifiesController.index').middleware('auth')
Route.post('/signup', 'AuthController.signup')
Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout')
Route.post('/accounts/edit', 'ProfilesController.update').middleware('auth')
Route.post('/posts/create', 'PostsController.store').middleware('auth')

// for get
Route.get('/posts/create', 'PostsController.create').middleware('auth')
Route.get('/verify/:email', 'EmailVerifiesController.confirm').as('verifyEmail')
Route.get('/accounts/edit', 'ProfilesController.edit').middleware('auth')
// get username 
Route.get('/:username', 'ProfilesController.index').middleware('auth')
