import { Component, OnInit } from '@angular/core'
import { NgxDbService } from 'ngx-db'
import { NgxPushviewStackConfig } from 'ngx-pushview'
import { StackOneComponent } from './components/stack.one.component'
import { StackTwoComponent } from './components/stack.two.component'
import { Article } from './models/Article'
import { Publication } from './models/Publication'
import { StackResolver } from './resolvers/stack.resolver'

export enum StackPaneId { ONE = 'one', TWO = 'two' }

@Component({ selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent implements OnInit {
  activePaneId: StackPaneId = StackPaneId.ONE
  stackConfigs: NgxPushviewStackConfig[] = [
    { id: 'one', label: 'Stack One', component: StackOneComponent },
    { id: 'two', label: 'Strack Two', component: StackTwoComponent, resolve: { timeout: StackResolver } }
  ]

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
