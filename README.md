# **Booking App**

# **Project Structure**
booking-app/
|__app
|  |
|__booking/
|   |
├   src/
│   ├── main.ts
│   ├── bookings/
│   │   ├── bookings.controller.ts
│   │   ├── bookings.controller.spec.ts
│   │   ├── bookings.service.ts
│   │   ├── bookings.service.spec.ts
│   │   ├── dto/booking.dto.ts
│   |── bookings.module.ts
├   |──test
├   |──tsconfig.app.json
|__search/
|   |
├   src/
│       search/
│   │   ├── search.controller.ts
│   │   ├── search.controller.spec.ts
│   │   ├── search.service.ts
│   │   ├── search.service.spec.ts
│   │   ├── dto/searchProfessional.dto.ts
│   |── search.module.ts
├   |──test
├   |──tsconfig.app.json
└── libs/
|      database/
|      |  └── src/
|      |    └── entity/
│      |   │   ├── professional.entity.ts
│      |   │   ├── booking.entity.ts
│      |   │   ├── idempotency.entity.ts
│      |   │   ├── availability.entity.ts
│      |   │   ├── base.entity.ts
├      |   ├──database.module.ts
├      |   ├──index.ts
├      ├── tsconfig.app.json
└── utils/
|       | src
|       ├──constraints/
|       |    |  ├── env.ts
│       |    |  ├── ssl-config.ts
|       ├──filters/
|       |    |  ├── validation-exception.filter.ts
|       |    |  ├── enums.ts
|       ├──generics/
|       |    |  ├── structure-response.ts
|       |    |  ├── query-params.ts
├       |    ├──database.module.ts
├       ├──index.ts
├       ├──utils.module.ts
├── package.json 
└── README.md
└── pnpm-lock.yaml
└── tsconfig.json
└── nest-cli.json
└──gitignore

# **Microservices Architecture**
Microservices architecture allows scaling individual components

API Gateway pattern provides a single entry point

PostgreSQL provides ACID compliance for booking transactions

NestJS offers good structure for maintainable code

# **Database Design**
**Main Tables:**

professionals - Professional details and rates

availabilities - Time slots when professionals are available

bookings - Client bookings with status and payment info

**Key Indexes:**

professionals(category, rate_per_minute) - For search filtering

availabilities(professional_id, start_time, end_time) - For availability checks

bookings(professional_id, start_time, status) - For conflict detection

bookings(idempotency_key) - Unique constraint for idempotency

# **Critical Flows**
**Creating a Booking:**

Client sends booking request with Idempotency-Key header

System checks for existing booking with same key

Validate professional exists and is available at requested time

Check for overlapping bookings

Calculate price based on professional's rate and duration

Create booking record with "pending" status

Create Stripe Payment Intent

Return booking details with payment intent client secret

**Confirming Stripe Payment:**

Stripe sends webhook for successful payment

System validates webhook signature

Find booking by payment intent ID

Update booking status to "confirmed"

Send confirmation email to client

# **Key Considerations**

**Double-booking Prevention:**

Database transactions with appropriate isolation level

Checking availability and existing bookings in same transaction

Using row-level locking if needed

**Idempotency:**

Idempotency key header stored with booking

Unique constraint on idempotency_key column

Returns same response for duplicate requests

**Monitoring:**

Log key operations (booking creation, payment processing)

Track error rates and performance metrics

Set up alerts for failed payments or system errors

**Security:**

Validate all inputs

Use HTTPS for all communications

Secure database credentials

Validate Stripe webhook signatures

# **Part 3: Deep Thinking Questions**

**1. How exactly does your solution prevent double-booking under load?**

Uses database transactions with serializable isolation level to ensure atomic checks and inserts

Implements row-level locking on professional availability during booking creation

Checks for existing bookings and availability within the same transaction

Uses unique constraints on idempotency keys to prevent duplicate processing

**2. How is your idempotency key scoped and cleaned?**

Idempotency keys are scoped per client and stored with each booking

Keys have a TTL (e.g., 24 hours) after which they can be cleaned up

A background job periodically removes old idempotency keys from completed/failed bookings

Keys are stored in the database with a timestamp for expiration management

**3. If search traffic increases 10×, what's your first scaling step?**

Implement Redis caching for search results with appropriate TTL

Add read replicas to the database to handle increased read load

Use Elasticsearch for professional search to offload from primary database

Implement API rate limiting to prevent abuse

**4. How would you make Stripe webhook handling reliable and idempotent?**

Store webhook events with their unique ID to prevent duplicate processing

Implement retry logic with exponential backoff for failed webhook processing

Use a queue system (e.g., RabbitMQ) to handle webhook events asynchronously

Validate Stripe signatures to ensure webhook authenticity

**5. If you split your architecture later, which modules would you separate first and why?**

Search Service - Can be separated to use specialized search databases (Elasticsearch)

Payment Service - Handles sensitive financial operations and should be isolated

Notification Service - Sending emails/SMS can be async and scaled independently

Booking Service - Core business logic that needs highest reliability

# **Prerequisites**

Node.js (v16 or higher)

PostgreSQL

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=bookings
# **Setup**

1. `pnpm install`
2. `pnpm run start:dev` (runs on http://localhost:3000/api for booking and http://localhost:3001/api for search )

# **Assumptions**
- See Part 1 document.
- Seed data: One professional ('pro1') with availability 2025-08-21 10:00-12:00 UTC.


**Create Booking:**
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-key-123" \
  -d '{"professional_id": "pro1", "start_time": "2025-08-21T10:00:00Z", "duration_minutes": 60}'

**Search professionals:**

  curl "http://localhost:3001/search/professionals?lat=5.6037&long=-0.187&location_radius_km=10&category=Plumber&rate_per_minute=500&travel_mode=car"