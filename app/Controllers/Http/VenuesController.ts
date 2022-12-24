import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Venue from "App/Models/Venue";
import VenueValidator from "App/Validators/VenueValidator";

export default class VenuesController {
  public async index({ response }: HttpContextContract) {
    try {
      const data = await Venue.query().preload("fields");
      return response.ok({ messages: "Get all data succeed!", data });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const {name, address, phone} = request.body()
    const userId = auth.user?.id;
    const venue = new Venue();

    try {
      await request.validate(VenueValidator);
      await venue.fill({name, address, phone, user_id: userId}).save();
      response.created({ messages: "New Data Venue created!" });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const venue_id = request.param("id");
    try {
      const data = await Venue.findOrFail(venue_id);
      response.ok({
        messages: `Get venue data by id: ${venue_id} succeed!`,
        data,
      });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const venue_id = request.param("id");
    const data = await request.validate(VenueValidator);

    try {
      const venue = await Venue.findOrFail(venue_id);
      await venue.merge(data).save();

      response.ok({ message: `Updated data ${venue_id} succesfully!` });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    const venue_id = request.param("id");
    try {
      const venue = await Venue.findOrFail(venue_id);
      await venue.delete();
      response.ok({ message: `Deleted data ${venue_id} succesfully!` });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }
}
