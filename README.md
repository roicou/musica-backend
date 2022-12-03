# Backend Template

## Logger
This back-end uses Winston for logger:
```js
import logger from '@/libs/logger';

logger.info('message');
logger.error('Error message');

```

## Mongoose
Database must be created if you want to authenticate

## Repository tree
```
./
├── 📁 src
│   ├── 📁 api
│   │   ├── 📄 index.ts
│   │   ├── 📁 middleware
│   │   │   └── 📄 index.ts
│   │   └── 📁 routes
│   │       ├── 📄 auth.ts
│   │       └── 📄 test.ts
│   ├── 📁 config
│   │   ├── 📄 httpcodes.config.ts
│   │   └── 📄 index.ts
│   ├── 📁 interfaces
│   │   └── 📄 user.interface.ts
│   ├── 📁 libs
│   │   └── 📄 logger.ts
│   ├── 📁 loaders
│   │   ├── 📄 express.loader.ts
│   │   ├── 📄 index.ts
│   │   └── 📄 mongoose.loader.ts
│   ├── 📁 models
│   │   └── 📄 user.model.ts
│   └── 📁 services
│       ├── 📄 api.service.ts
│       └── 📄 auth.service.ts
├── 📁 thunder-tests
│   ├── 📄 thunderActivity.json
│   ├── 📄 thunderCollection.json
│   ├── 📄 thunderEnvironment.json
│   └── 📄 thunderclient.json
├── 📄 .env.sample
├── 📄 .gitignore
├── 📄 app.ts
├── 📄 custom.d.ts
├── 📄 package.json
├── ℹ️ README.md
├── 📄 tsconfig.json
└── 📄 upload_server.sh
```