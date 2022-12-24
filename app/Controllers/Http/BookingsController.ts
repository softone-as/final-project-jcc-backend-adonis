import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Booking from "App/Models/Booking";
import Field from "App/Models/Field";
import User from "App/Models/User";

export default class BookingsController {
  public async index({ request, response }: HttpContextContract) {
    const fieldId = request.param("field_id");
    try {
      const bookings = await Booking.query()
        .where("field_id", fieldId)
        .preload("players", (userQuery) => {
          userQuery.select(["id", "name", "email"]);
        });
      return response.ok({ messages: "Get all data succeed!", data: bookings });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }

  /**
	* 	
	* @swagger

	*/
  public async store({ request, response, auth }: HttpContextContract) {
    const { play_date_start, play_date_end } = request.body();
    const { field_id } = request.params();
    const user_id = auth.user?.id;

    const user = await User.findOrFail(user_id);
    const field = await Field.findOrFail(field_id);

    const checkBookingStart = await Booking.query()
      .whereBetween("play_date_start", [play_date_start, play_date_end])
      .andWhere("field_id", field_id)
      .orderBy("play_date_end", "desc")
      .limit(1)
      .first();

    const checkBookingEnd = await Booking.query()
      .whereBetween("play_date_end", [play_date_start, play_date_end])
      .andWhere("field_id", field_id)
      .orderBy("play_date_end", "desc")
      .limit(1)
      .first();

    try {
      //   check if field is ready to booked at this time
      if (!checkBookingStart && !checkBookingEnd) {
        const booking = new Booking();
        booking.fill({
          play_date_start,
          play_date_end,
          booking_user_id: user.id,
          fieldId: field.id,
        });

        await booking.related("field").associate(field);
      }
      response.created({ messages: "Booking succeed!" });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    try {
      const bookings = await Booking.query()
        .where("id", id)
        .preload("players", (userQuery) => {
          userQuery.select(["id", "name", "email"]);
        })
        .preload("field", (fieldQuery) => {
          fieldQuery.select(["name", "type"]);
        })
        .withCount("players")
        .firstOrFail();

      response.ok({ messages: "Get data by id success", data: bookings });
    } catch (error) {
      response.badRequest({ messages: error.message });
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    const bookingId = request.param("id");
    const booking = await Booking.findOrFail(bookingId);

    try {
      await booking.delete();
      return response.ok({ message: "Booking deleted!" });
    } catch (error) {
      return response.badRequest({ message: error });
    }
  }

  public async join({ auth, request, response }: HttpContextContract) {
    const { id } = request.params();
    const booking = await Booking.findOrFail(id);
    let user = auth.user!;

    try {
      await booking.related("players").attach([user.id]);
      response.ok({ status: "Success!", messages: "Player added!" });
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }

  public async unjoin({ auth, request, response }: HttpContextContract) {
    const { id } = request.params();
    const booking = await Booking.findOrFail(id);
    let user = auth.user!;

    try {
      await booking.related("players").detach([user.id]);
      response.ok({ status: "Success!", messages: "Player canceled!" });
    } catch (error) {
      response.badRequest({ messages: error.messages });
    }
  }
}
