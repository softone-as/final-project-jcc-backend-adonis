import Hash from "@ioc:Adonis/Core/Hash";
import {
  BaseModel,
  beforeSave,
  column,
  hasMany,
  HasMany,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Booking from "./Booking";
import Venue from "./Venue";

/**
 *
 * @swagger
 *  components:
 *    schemas:
 *       User:
 *         type: object
 *         properties:
 *         	id:
 *         		type: number
 *         	name:
 *         		type: string
 *         	email:
 *         		type: string
 *         	password:
 *         		type: string
 *         	role:
 *         		type: string
 *         	is_verified:
 *         		type: boolean
 */

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public email: string;

  @column()
  public role: string;

  @column()
  public is_verified: boolean;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @manyToMany(() => Booking, {
    localKey: "id",
    pivotForeignKey: "user_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "booking_id",
  })
  public bookings: ManyToMany<typeof Booking>;

  @hasMany(() => Venue)
  public venues: HasMany<typeof Venue>;

  @hasMany(() => Booking)
  public myBookings: HasMany<typeof Booking>;
}
