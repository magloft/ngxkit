import { Component, OnInit } from '@angular/core'
import { NgxDbService } from 'ngx-db'
import { Article, Publication } from './db.models'

@Component({ selector: 'app-db', template: '<h2>NgxDb</h2><div class="padding">Angular IndexDB Library</div>' })
export class DbComponent implements OnInit {
  constructor(public db: NgxDbService) { }

  async ngOnInit() {
    await Publication.removeAll()
    const publication: Publication = await Publication.create({ title: 'Test Publication' })
    const article: Article = new Article({ title: 'Hello World 1', description: 'Sample Description' }, publication)
    publication.articles.push(article)
    await publication.save()
    const savedPublication = await Publication.findOne<Publication>('title', 'Test Publication')
    await savedPublication.remove()
  }
}


