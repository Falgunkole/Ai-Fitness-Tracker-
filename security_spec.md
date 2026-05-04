# Security Specification - AI Smart Gym

## Data Invariants
1. A user can only access their own profile, workouts, food logs, and insights.
2. A workout must have at least one set.
3. Timestamps are immutable and must match server time on creation.
4. User weight must be positive.
5. Calorie values must be non-negative.

## The Dirty Dozen Payloads (Rejections)

1. **Identity Spoofing**: Attempt to create a workout for another user's UID.
2. **Shadow Update**: Attempt to elevate another user's weight or change their goal.
3. **Ghost Field**: Adding `isAdmin: true` to a user profile update.
4. **ID Poisoning**: Using a 2KB string as a workout ID.
5. **PII Leak**: An authenticated user trying to list all user profiles.
6. **Negative Calories**: Logging food with -500 calories.
7. **Negative Weight**: Setting body weight to -70kg.
8. **Malicious ID**: Using `../workouts/someId` as a document ID.
9. **Timestamp Fraud**: Setting `createdAt` to a date in 2030.
10. **Orphaned Workout**: Creating a workout for a `userId` that doesn't exist in the `/users` collection.
11. **Massive Set List**: Attempting to add an array of 5,000 sets to a workout.
12. **Type Poisoning**: Sending a string for a calorie count field.

## Firestore Rules Drafting

I will now implement these constraints in `firestore.rules`.
