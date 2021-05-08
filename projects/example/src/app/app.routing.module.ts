import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AnimeComponent } from './components/anime/anime.component'
import { DbComponent } from './components/db/db.component'
import { IndexComponent } from './components/index/index.component'
import { PushviewComponent } from './components/pushview/pushview.component'

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'anime', component: AnimeComponent },
  { path: 'db', component: DbComponent },
  { path: 'pushview', component: PushviewComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
