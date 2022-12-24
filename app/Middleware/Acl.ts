import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Acl {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const userRole = auth.user?.role;
    userRole === "owner"
      ? await next()
      : response.unauthorized({ message: "Please use Owner's roles!" });
  }
}
