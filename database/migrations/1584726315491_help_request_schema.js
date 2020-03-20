'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HelpRequestSchema extends Schema {
  up () {
    this.create('help_requests', (table) => {
      table.increments()
      table.integer('lat')
      table.integer('lng')
      table.string('category')
      table.string('fbid')
      table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('help_requests')
  }
}

module.exports = HelpRequestSchema
