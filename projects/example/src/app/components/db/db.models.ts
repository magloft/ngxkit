import { attribute, ChildModel, collection, Model } from 'ngx-db'

export class Article extends ChildModel {
  public id: number
  public title: string
  public description: string
}

export class Publication extends Model {
  @attribute({ primary: true }) id?: number
  @attribute({ required: true, unique: true }) title: string
  @collection({ ModelType: Article }) articles: Article[]
}
