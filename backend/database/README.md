# Database workflow

`schema.sql` is the complete schema for an empty PostgreSQL database.
`migrations/` contains immutable, ordered repairs for existing databases.
`seed.sql` contains idempotent reference data and never creates login users.

Run the database commands from `backend/`:

```bash
npm run db:migrate:dry
npm run db:migrate
npm run db:seed
npm run db:check
npm run db:smoke
npm run db:verify
```

The migration runner records the SHA-256 checksum of every applied migration
in `schema_migrations`. Never edit an applied migration. Add a new numbered SQL
file instead.

`db:check` validates required columns, canonical status values, profile
relationships, and balanced billing amounts. `db:smoke` executes the principal
read models without printing patient or credential data. `db:verify` exercises
the booking write workflow inside a transaction and deliberately rolls it back,
proving that no partial appointment data can be committed.

The application retains its original quoted PostgreSQL identifiers (for
example, `"Appointment_ID"`) to avoid a risky all-at-once API rewrite. The
logical model and relationships are canonical even though these physical names
remain for compatibility.
