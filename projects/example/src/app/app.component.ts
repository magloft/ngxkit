import { Component, OnInit } from '@angular/core'
import { NgxDbService } from 'projects/db/public-api'
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
    const publication: Publication = await Publication.create({ title: 'Test Publication' })
    const article: Article = new Article({ title: 'Hello World 1', description: 'Sample Description' }, publication)
    publication.articles.push(article)
    await publication.save()
    const savedPublication = await Publication.findOne<Publication>('title', 'Test Publication')
    await savedPublication.remove()
  }
}
