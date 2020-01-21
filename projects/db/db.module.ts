import { CommonModule } from '@angular/common'
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core'
import { CONFIG_TOKEN, DBConfig } from './db.schema'
import { NgxDbService } from './db.service'

@NgModule({
  declarations: [],
  imports: [CommonModule]
})
export class NgxDbModule {
  static forRoot(dbConfig: DBConfig): ModuleWithProviders<NgxDbModule> {
    return {
      ngModule: NgxDbModule,
      providers: [NgxDbService, { provide: CONFIG_TOKEN, useValue: dbConfig }]
    }
  }

  constructor(@Optional() @SkipSelf() parentModule: NgxDbModule) {
    if (parentModule) {
      throw new Error('NgxDbModule is already loaded. Import it in the AppModule only')
    }
  }
}
