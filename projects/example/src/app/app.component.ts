import { Component, OnInit } from '@angular/core'
import { NgxDbService } from '../../../db/public-api'
import { Article } from './models/Article'
import { Publication } from './models/Publication'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public db: NgxDbService) {}

  async ngOnInit() {
    await Publication.removeAll()
    await Article.removeAll()
    const publication: Publication = await Publication.create({ title: 'Test Publication' })
    const article: Article = await Article.create({ title: 'Hello World 1', description: 'Sample Description' })
    publication.articleIds.add(article.id)
    await publication.save()
  }
}
