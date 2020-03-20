'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {import("../../Models/HelpRequest")} */
const HelpRequest = use('App/Models/HelpRequest');

/**
 * Resourceful controller for interacting with helprequests
 */
class HelpRequestController {
  /**
   * Show a list of all helprequests.
   * GET helprequests
   *
   * @param {object} ctx
   * @param {View} ctx.view
   */
  async index({ view }) {
    let requests = HelpRequest.all()
    return view.render('requests', requests)
  }

  /**
   * Render a form to be used for creating a new helprequest.
   * GET helprequests/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new helprequest.
   * POST helprequests
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {

  }

  /**
   * Display a single helprequest.
   * GET helprequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing helprequest.
   * GET helprequests/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update helprequest details.
   * PUT or PATCH helprequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a helprequest with id.
   * DELETE helprequests/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = HelpRequestController
