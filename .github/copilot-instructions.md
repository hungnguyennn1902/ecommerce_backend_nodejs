# Copilot Instructions for eCommerce Backend

## Architecture Overview

This is a Node.js eCommerce backend using **CommonJS** (not ES Modules). The architecture follows a layered pattern:

```
Routes → Controllers → Services → Repositories → Models (Mongoose)
```

**Critical:** Always use `require()` and `module.exports`, never `import`/`export`. Top-level `await` is not allowed.

## Project Structure

- **`src/routes/`** - API endpoints with nested route folders (e.g., `product/index.js`, `access/index.js`)
- **`src/controllers/`** - Request handlers that call services and return standardized responses
- **`src/services/`** - Business logic (Factory patterns for products, discount logic, etc.)
- **`src/models/repositories/`** - Database query abstractions (e.g., `product.repo.js`)
- **`src/models/`** - Mongoose schemas (naming: `{entity}.model.js`)
- **`src/auth/`** - API key validation (`checkAuth.js`) and JWT authentication (`authUtils.js`)
- **`src/core/`** - Response classes (`success.response.js`, `error.response.js`)
- **`src/helpers/`** - Utilities like `asyncHandler.js` for async error handling
- **`src/utils/`** - Lodash-based helpers for object manipulation

## Key Conventions

### 1. Response Handling
All successful responses use classes from `src/core/success.response.js`:
```javascript
const { Created, SuccessResponse } = require('../core/success.response');

// In controller:
new Created({
    message: 'Product created successfully',
    data: await ProductService.createProduct(...)
}).send(res);
```

Errors extend classes from `src/core/error.response.js` (e.g., `BadRequestError`, `NotFoundError`).

### 2. Async Route Handlers
**Always** wrap async route handlers with `asyncHandler`:
```javascript
const asyncHandler = require('../../helpers/asyncHandler');
router.post('/create', asyncHandler(productController.createProduct));
```

### 3. Authentication Flow
- **API Key check** (`x-api-key` header) - applied globally in `src/routes/index.js`
- **Permission check** - `permission('0000')` middleware validates API key permissions
- **JWT authentication** - `authentication` middleware (from `authUtils.js`) validates JWT tokens
  - Sets `req.user` with `{ userId, email }`
  - Applied per-route or per-router basis

Example from `src/routes/product/index.js`:
```javascript
router.get('/all', asyncHandler(productController.getAllProducts)); // Public
router.use(authentication); // All routes below require JWT
router.post('/create', asyncHandler(productController.createProduct)); // Protected
```

### 4. Model Naming & Structure
- **File naming:** `{entity}.model.js` (e.g., `product.model.js`, `user.model.js`)
- **Field naming:** Use prefixed fields like `product_name`, `usr_email`, `shop_email`
- **Collections:** Define custom collection names in schema options
- **Timestamps:** Always include `timestamps: true`

Example:
```javascript
const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    // ...
}, {
    timestamps: true,
    collection: 'Products'
});
```

### 5. Service Patterns

#### Factory Pattern (Products)
The `ProductFactory` creates product type-specific classes:
```javascript
class ProductFactory {
    static async createProduct(type, payload) {
        const productClasses = { Clothing, Electronic };
        const productClass = productClasses[type];
        if (!productClass) throw new BadRequestError(`Invalid product type`);
        return await new productClass(payload).createProduct();
    }
}
```

Each product type extends base `Product` class and creates both:
1. Type-specific document (e.g., in `Clothes` collection)
2. Main product document (in `Products` collection) with **same `_id`**

```javascript
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({...this.product_attributes});
        const newProduct = await super.createProduct(newClothing._id); // Pass _id
        return newProduct;
    }
}
```

#### Static Service Methods
Services use static methods exclusively:
```javascript
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => { ... }
    static findByUserId = async (userId) => { ... }
}
```

### 6. Repository Pattern
Database queries are abstracted into repository files (`src/models/repositories/`):
```javascript
// src/models/repositories/product.repo.js
const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
};
```

Services call repositories, never query models directly in services.

### 7. Utility Functions
Use helpers from `src/utils/index.js`:
- **`removeUndefinedObject(obj)`** - Clean undefined/null values before updates
- **`updateNestedObjectParser(obj)`** - Flatten nested objects for MongoDB `$set`
- **`getInfoData({ object, fields })`** - Pick specific fields (uses lodash)
- **`getSelectData(select)` / `getUnSelectData(unselect)`** - Build MongoDB projection

Example:
```javascript
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');
const cleanPayload = removeUndefinedObject(payload);
const updateSet = updateNestedObjectParser(cleanPayload);
await product.updateOne({ _id }, { $set: updateSet });
```

### 8. Redis Integration
Redis client uses **lazy initialization** (no top-level await):
```javascript
// src/services/redis.service.js
let client = null;
const initRedisClient = async () => {
    if (!client) {
        client = createClient().on("error", ...);
        await client.connect();
    }
    return client;
};

const acquireLock = async ({ productId, quantity, cartId }) => {
    const redisClient = await initRedisClient();
    // ... use redisClient
};
```

### 9. Discord Logging (Optional)
Logger queues messages until bot is ready:
```javascript
// src/logger/discord.logv2.js
// Usage in middleware:
discordLogger.sendToFormatCode({
    title: `Method: ${req.method}`,
    message: `${req.get('host')}${req.originalUrl}`,
    code: req.body
});
```

## Development Workflow

### Running the Server
```bash
npm start  # Uses nodemon, watches for changes
```

### Environment Variables (`.env`)
Required variables:
- `DEV_APP_PORT` - Server port (default: 3000)
- `DEV_DB_HOST`, `DEV_DB_PORT`, `DEV_DB_NAME` - MongoDB connection
- `DISCORD_BOT_TOKEN`, `LOG_CHANNEL_ID_DISCORD` - Discord logging (optional)

### Testing API Requests
Use VS Code REST Client extension with `src/postman/access.post.http`:
- **No `Content-Type: application/json` on GET requests** (causes body-parser errors)
- Include `x-api-key` header on all requests
- Include `authorization` and `x-client-id` headers for authenticated endpoints

## Common Patterns

### Creating New Endpoints
1. Add route in `src/routes/{entity}/index.js`
2. Create controller method in `src/controllers/{entity}.controller.js`
3. Implement service logic in `src/services/{entity}.service.js`
4. Add repository queries in `src/models/repositories/{entity}.repo.js` if needed

### Error Handling
Controllers don't need try-catch; `asyncHandler` propagates errors to Express error middleware:
```javascript
// src/app.js handles all errors
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    });
});
```

### Mongoose ObjectId Handling
Mongoose auto-converts strings to ObjectId. Avoid manual conversion:
```javascript
// ❌ Don't do:
keyTokenModel.findOne({ user: new mongoose.Types.ObjectId(userId) });

// ✅ Do:
keyTokenModel.findOne({ user: userId });
```

## Integration Points

- **MongoDB** - Primary database (Mongoose ODM)
- **Redis** - Distributed locking for inventory reservations
- **Discord.js** - Optional request logging to Discord channel
- **AWS S3** - File uploads (see `@aws-sdk/*` packages)
- **RabbitMQ** (`amqplib`) & **Kafka** (`kafkajs`) - Message queues (in `src/message_queue/`)

## Best Practices for This Codebase

1. **Never use ES Modules syntax** (`import`/`export`) - project uses CommonJS
2. **Wrap all async routes** with `asyncHandler`
3. **Use Factory pattern** when creating entities with subtypes
4. **Keep MongoDB queries in repositories**, not in services
5. **Return standardized responses** using `Created`/`SuccessResponse` classes
6. **Apply authentication middleware** at router level where appropriate
7. **Clean objects before updates** using `removeUndefinedObject` and `updateNestedObjectParser`
8. **Use field prefixes** in models (`product_*`, `usr_*`, `shop_*`)
