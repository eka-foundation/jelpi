'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on("/").render("jelpi");
Route.on("/privacy").render("privacy");

Route.get('tasks', 'TaskController.index')
Route.post('tasks', 'TaskController.store')

Route.get('facebook', async ({ ally }) => {
  await ally.driver('facebook').redirect();
})

Route.get('authenticated/facebook', async ({ ally, view }) => {
  const fb_user = await ally.driver('facebook').getUser();
  return view.render('jelpi', { name: fb_user.getName(), fb_id: fb_user.getId() })
})
