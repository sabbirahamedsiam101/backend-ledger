// src/constants/roles.js

export const ROLES = Object.freeze({
  USER: 'USER',
  LEDGER_AUDITOR: 'LEDGER_AUDITOR',
  ADMIN: 'ADMIN'
});


// Extract array values for Mongoose enum and Zod validation lists
export const ROLE_LIST = Object.values(ROLES); // ['USER', 'LEDGER_AUDITOR', 'ADMIN']
