import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Venue from "./Venue";
import Booking from "./Booking";

// /**
//  * @swagger
//  * components:
//  * schemas:
//  *      Field:
//  *        type: object
//  *        properties:
//  *          id:
//  *            type: number
//  *          name:
//  *            type: string
//  *          type:
//  *            type: enum
//  *          venue_id:
//  *            type: number
//  *          createdAt:
//  *            type: datetime
//  *          updatedAt:
//  *            type: datetime
//  *
//  */

export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public type:
    | "soccer"
    | "mini soccer"
    | "futsal"
    | "basketball"
    | "volleyball";

  @column({ columnName: "venue_id" })
  public venueId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Venue)
  public venue: BelongsTo<typeof Venue>;

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>;
}
