import { Adapter } from './src/adapter'
import { CacheDatabase } from './src/db-cache'
import { Driver } from './src/driver'

const scope = self as any as ServiceWorkerGlobalScope

const adapter = new Adapter(scope.registration.scope)
const driver = new Driver(scope, adapter, new CacheDatabase(scope, adapter))

