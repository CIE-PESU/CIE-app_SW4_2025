# Adding New Users

## Steps

### 1. Edit `prisma/seed.ts`

Find the `userData` array (around line 140) and add a new entry:

```ts
{ email: 'newuser@pes.edu', name: 'Full Name', role: 'STUDENT' as const },
```

**Available roles:** `ADMIN`, `FACULTY`, `STUDENT`

### 2. Re-seed the database

Run the following command from the project root:

```bash
npx tsx prisma/seed.ts
```

This will:
- Create the new user with password `password123`
- Reset passwords for all existing users to `password123`
- Re-create courses, components, projects, and other seed data

### 3. Login

The new user can now log in at `http://localhost:3000` with:
- **Email:** the email you added
- **Password:** `password123`

---

## Notes

- All users share the default password `password123`.
- The seed script is **safe to re-run** — it skips existing users and updates their passwords.
- Student IDs are auto-generated using the format `PES{campus}UG{year}CS{roll}`.
- If the seed fails with a `student_id` unique constraint error, it usually means all users already exist. The passwords will still have been updated — you can safely ignore this.
