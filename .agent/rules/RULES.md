# Project Core Rules

1. **Maximum Type Safety**
   - Write strongly-typed code at all times.
   - Do NOT use the `any` type under any circumstances. Always define explicit interfaces, types, or use `unknown` if the type is truly not known (and narrow it down later).

2. **Always Use DTOs**
   - Data Transfer Objects (DTOs) must be created and used for all requests and responses.
   - Never pass raw entity objects directly dynamically outside the standard boundaries without proper typings or DTO transformations.

3. **Follow ESLint & Prettier Rules**
   - Always format code strictly using 2 spaces for indentation.
   - For multi-line imports, objects, arrays, and arguments, always apply proper indentation (2 spaces) and ensure trailing commas where appropriate. Example:
     ```typescript
     import {
       Entity,
       PrimaryGeneratedColumn,
       Column,
       CreateDateColumn,
       UpdateDateColumn,
     } from 'typeorm';
     ```
   - Pay close attention to spacing and punctuation correctness to avoid ESLint/Prettier warnings.
