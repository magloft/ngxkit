import { attribute, Model } from 'projects/db/public-api'
import { Article } from './Article'

export class Publication extends Model {
  @attribute({ primary: true }) id?: number
  @attribute({ required: true, unique: true }) title: string
  @attribute() articleIds: Set<number>

  constructor(data?: any) {
    super(data)
    if (!this.articleIds) { this.articleIds = new Set() }
  }

  async getArticles(): Promise<Article[]> { return Article.findByKeys(this.articleIds) }
}
