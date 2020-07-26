import { NgxDbService } from './db.service'

interface NgxDbPortalInterface {
  dbService: NgxDbService
  services: { [key: string]: any },
  registerService: (name: string, service: any) => void
}

export const NgxDbPortal: NgxDbPortalInterface = {
  dbService: null,
  services: {},
  registerService(name: string, service: any) {
    this.services[name] = service
  }
}
