import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Field from "./Field";
import User from "./User";

// /**
//  * @swagger
//  * components:
//  * schemas:
//  *      Venue:
//  *        type: object
//  *        properties:
//  *          id:
//  *            type: number
//  *          name:
//  *            type: string
//  *          address:
//  *            type: string
//  *          phone:
//  *            type: string
//  *          user_id:
//  *            type: number
//  *           createdAt:
//  *            type: datetime
//  *          updatedAt:
//  *            type: datetime
//  *
//  */

export default class Venue extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public address: string;

  @column()
  public phone: string;

  @column()
  public user_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Field)
  public fields: HasMany<typeof Field>;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;
}
