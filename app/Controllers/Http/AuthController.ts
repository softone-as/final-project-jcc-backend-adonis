import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { schema } from "@ioc:Adonis/Core/Validator";
import RegisterValidator from "App/Validators/RegisterValidator";
import Mail from "@ioc:Adonis/Addons/Mail";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AuthController {
  /**
   *
   * @swagger
   *  "/api/v1/register":
   *     post:
   *       tags:
   *       - Authentication
   *       summary: Register Account
   *       description: Endpoint for register new user
   *       requestBody:
   *         content:
   *           application/x-www-form-urlencoded:
   *             schema:
   *               "$ref": "#/definitions/User"
   *           application/json:
   *             schema:
   *               "$ref": "#/definitions/User"
   *       responses:
   *         '200':
   *           description: Register success, check your email for verify account
   *         '422':
   *           description: Invalid Request
   */
  public async register({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(RegisterValidator);
      const newUser = await User.create(data);

      const otpCode = Math.floor(100000 + Math.random() * 900000);

      await Database.table("otp_codes").insert({
        otp_code: otpCode,
        user_id: newUser.id,
      });
      await Mail.send((message) => {
        message
          .from("adonis.demo@sanberdev.com")
          .to(data.email)
          .subject("Welcome Onboard!")
          .htmlView("emails/otp_verification", { name: data.name, otpCode });
      });

      response.created({
        message: "Register succes, please verify your OTP code!",
      });
    } catch (error) {
      response.unprocessableEntity({ messages: error.message });
    }
  }

  public async otpConfirmation({ request, response }: HttpContextContract) {
    let { email, otp_code } = request.body();

    let user = await User.findByOrFail("email", email);
    let otpCheck = await Database.query()
      .from("otp_codes")
      .where("otp_code", otp_code)
      .first();

    if (user?.id === otpCheck.user_id) {
      user.is_verified = true;
      await user?.save();
      return response.ok({ message: "OTP Verification Success!" });
    } else {
      return response.badRequest({ message: "OTP Verification Failed!" });
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string(),
      password: schema.string(),
    });

    const { email, password } = request.body();

    try {
      await request.validate({ schema: userSchema });

      const token = await auth.use("api").attempt(email, password);
      return response.ok({ messages: "login succes!", token });
    } catch (error) {
      if (error.guard) {
        return response.badRequest({
          messages: "Login Error Guard!",
          error: error.message,
        });
      } else {
        return response.badRequest({
          messages: "Login Error but not Guard!",
          error: error.messages,
        });
      }
    }
  }
}
