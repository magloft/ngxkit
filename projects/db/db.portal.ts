import { NgxDbService } from './db.service'

interface NgxDbPortalInterface {
  dbService: NgxDbService
}

export const NgxDbPortal: NgxDbPortalInterface = {
  dbService: null
}
