# TODO - NestJS security/industry-standard audit

## Step 1: Create baseline fixes (config/secrets)

- [ ] Add @nestjs/config + .env-based configuration for JWT secrets
- [ ] Remove hard-coded secrets from JwtStrategy and JwtModule registration
- [ ] Ensure app fails fast when secrets are missing

## Step 2: Harden authorization primitives

- [x] Update RolesGuard to safely handle missing/invalid request.user
- [x] Ensure it throws Unauthorized/Forbidden appropriately

## Step 3: Fix/complete DTO validation

- [ ] Implement UpdatePlaylistDto with class-validator rules

## Step 4: Protect sensitive routes

- [ ] Protect PATCH/DELETE playlist routes with JwtAuthGuard
- [ ] Add ownership/admin guard for playlist update/delete (owner OR admin)

## Step 5: Protect user routes

- [ ] Protect PATCH/DELETE users with JwtAuthGuard + self/admin guard
- [ ] Restrict GET /users and/or GET /users/:id according to implementation (self OR admin)

## Step 6: Apply global security headers

- [ ] Apply helmet() globally (not only /songs)
- [ ] Keep CORS global

## Step 7: Run checks

- [ ] npm run lint
- [ ] npm test

---

## Current status

- RolesGuard hardened ✅
- Remaining TODO items require broader security changes beyond this single guard fix.
- Current repo also has pre-existing lint/test failures unrelated to the RolesGuard change.
