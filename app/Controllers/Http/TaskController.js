'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {import("../../Models/Task")} */

const Task = use('App/Models/Task');

/**
 * Resourceful controller for interacting with Tasks
 */
class TaskController {
  /**
   * Show a list of all Tasks.
   * GET Tasks
   *
   * @param {object} ctx
   * @param {View} ctx.view
   */
  async index({ view }) {
    let tasks = Task.all()
    return tasks
  }

  /**
   * Render a form to be used for creating a new Task.
   * GET Tasks/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new Task.
   * POST Tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const task = new Task();
    task.name = request.input("name");
    task.lat = request.input("lat");
    task.lng = request.input("lng");
    task.category = request.input("category");
    task.fbid = '2957526370935693';
    await task.save();
  }

  /**
   * Display a single Task.
   * GET Tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing Task.
   * GET Tasks/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update Task details.
   * PUT or PATCH Tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a Task with id.
   * DELETE Tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = TaskController
