import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Field from "App/Models/Field";
import Venue from "App/Models/Venue";
import FieldValidator from "App/Validators/FieldValidator";

export default class FieldsController {
  public async index({ request, response }: HttpContextContract) {
    const venueId = request.param("venue_id");
    try {
      const fields = await Field.query().where("venue_id", venueId);
      return response.ok({ messages: "Get all data succeed!", data: fields });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const venueId = request.param("venue_id");
    const field = new Field();
    const { name, type } = request.body();

    try {
      const venue = await Venue.findOrFail(venueId);
      await request.validate(FieldValidator);
      field.fill({ name, type });

      await venue.related("fields").save(field);

      return response.created({ message: "New Field stored!" });
    } catch (error) {
      return response.badRequest({ message: error });
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const field_id = request.param("id");
    const venueId = request.param("venue_id");

    try {
      const fields = await Field.query()
        .where("id", field_id)
        .andWhere("venue_id", venueId)
        .preload("venue", (venueQuery) => {
          venueQuery.select(["name", "address", "phone"]);
        })
        .preload("bookings", (bookingQuery) => {
          bookingQuery.select([
            "play_date_start",
            "play_date_end",
            "booking_user_id",
          ]);
        });

      return response.ok({
        messages: `Get data field: ${field_id} succeed!`,
        data: fields,
      });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const fieldId = request.param("id");
    const venueId = request.param("venue_id");
    const { name, type } = request.body();

    const field = await Field.findOrFail(fieldId);
    try {
      const venue = await Venue.findOrFail(venueId);
      await request.validate(FieldValidator);
      field.merge({ name, type });

      await venue.related("fields").save(field);

      return response.ok({ message: "Field updated!" });
    } catch (error) {
      return response.badRequest({ message: error });
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    const fieldId = request.param("id");
    const field = await Field.findOrFail(fieldId);

    try {
      await field.delete();
      return response.ok({ message: "Field deleted!" });
    } catch (error) {
      return response.badRequest({ message: error });
    }
  }
}
