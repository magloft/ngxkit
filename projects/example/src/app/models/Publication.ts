import { attribute, collection, Model } from 'ngx-db'
import { Article } from './Article'

export class Publication extends Model {
  @attribute({ primary: true }) id?: number
  @attribute({ required: true, unique: true }) title: string
  @collection({ ModelType: Article }) articles: Article[]
}
