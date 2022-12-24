import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
  computed,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Field from "./Field";

// /**
//  * @swagger
//  * components:
//  * schemas:
//  *      Booking:
//  *        type: object
//  *        properties:
//  *          id:
//  *            type: number
//  *          play_date_start:
//  *            type: datetime
//  *          play_date_end:
//  *            type: string
//  *          user_id:
//  *            type: number
//  *          field_id:
//  *            type: number
//  *
//  */

export default class Booking extends BaseModel {
  public serializeExtras = true;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public play_date_start: DateTime;

  @column()
  public play_date_end: string;

  @column()
  public booking_user_id: number;

  @column({ columnName: "field_id" })
  public fieldId: number;

  @manyToMany(() => User, {
    localKey: "id",
    pivotForeignKey: "booking_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "user_id",
    pivotTable: "booking_user",
  })
  public players: ManyToMany<typeof User>;

  @belongsTo(() => Field)
  public field: BelongsTo<typeof Field>;

  @belongsTo(() => User)
  public bookingUser: BelongsTo<typeof User>;

  @computed()
  public get players_count() {
    return this.players.length;
  }
}
