import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.group(() => {

  router.post('login', [controllers.AccessTokens, 'store'])

  router
    .get('me', [controllers.AccessTokens, 'me'])
    .use(middleware.auth({ guards: ['admin'] }))

  router
    .group(() => {
      router.get('/', [controllers.Course, 'getAll'])
      router.get('/:id', [controllers.Course, 'getCourse'])
      router.post('/', [controllers.Course, 'create'])
      router.put('/:id', [controllers.Course, 'update'])
      router.delete('/:id', [controllers.Course, 'destroy'])
    })
    .prefix('course')
    .use(middleware.auth({ guards: ['admin'] }))
  router  
    .group(() => {      
      router.get('/', [controllers.Chapters, 'index'])
      router.get('/:id', [controllers.Chapters, 'show'])
      router.post('/', [controllers.Chapters, 'store'])
      router.put('/:id', [controllers.Chapters, 'update'])
      router.delete('/:id', [controllers.Chapters, 'destroy'])
    })
    .prefix('chapter')
    .use(middleware.auth({ guards: ['admin'] }))
}).prefix('admin')
