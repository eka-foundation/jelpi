'use strict'

const { test, trait } = use('Test/Suite')('Index')

trait('Test/ApiClient')

test('index page renders', async ({ client }) => {
  const response = await client.get('/').end()
  response.assertStatus(200)
})
