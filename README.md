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
âââ đ src
â   âââ đ api
â   â   âââ đ index.ts
â   â   âââ đ middleware
â   â   â   âââ đ index.ts
â   â   âââ đ routes
â   â       âââ đ auth.ts
â   â       âââ đ test.ts
â   âââ đ config
â   â   âââ đ httpcodes.config.ts
â   â   âââ đ index.ts
â   âââ đ interfaces
â   â   âââ đ user.interface.ts
â   âââ đ libs
â   â   âââ đ logger.ts
â   âââ đ loaders
â   â   âââ đ express.loader.ts
â   â   âââ đ index.ts
â   â   âââ đ mongoose.loader.ts
â   âââ đ models
â   â   âââ đ user.model.ts
â   âââ đ services
â       âââ đ api.service.ts
â       âââ đ auth.service.ts
âââ đ thunder-tests
â   âââ đ thunderActivity.json
â   âââ đ thunderCollection.json
â   âââ đ thunderEnvironment.json
â   âââ đ thunderclient.json
âââ đ .env.sample
âââ đ .gitignore
âââ đ app.ts
âââ đ custom.d.ts
âââ đ package.json
âââ âšī¸ README.md
âââ đ tsconfig.json
âââ đ upload_server.sh
```