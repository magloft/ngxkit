import { ChildModel } from 'projects/db/public-api'

export class Article extends ChildModel {
  public id: number
  public title: string
  public description: string
}
