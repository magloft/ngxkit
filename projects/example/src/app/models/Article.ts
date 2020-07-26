import { ChildModel } from 'ngx-db'

export class Article extends ChildModel {
  public id: number
  public title: string
  public description: string
}
