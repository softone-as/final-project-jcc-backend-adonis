import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Verify {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const isVerified = auth.user?.is_verified;
    isVerified == true
      ? await next()
      : response.unauthorized({
          message: "Do Verification with OTP Code first !",
        });
  }
}
