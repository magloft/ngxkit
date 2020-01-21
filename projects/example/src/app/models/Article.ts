import { attribute, Model } from 'projects/db/public-api'

export class Article extends Model {
  @attribute({ primary: true }) id?: number
  @attribute({ required: true, unique: true }) title: string
  @attribute() description: string
}
