// Ambient declarations for the local `database` package used by the API.
// Provide common named exports as `any` so TypeScript builds succeed when
// the package does not include its own type definitions.
declare module "database" {
  // Prisma client instance (approximate)
  export const prisma: any;

  // Common enums/types used in the codebase — provide both a runtime value
  // (as `any`) and a type so code that uses these symbols as values or types
  // will compile. Replace with real definitions if available.
  export const UserRole: any;
  export type UserRole = typeof UserRole;

  export const UserPlan: any;
  export type UserPlan = typeof UserPlan;

  export const ServiceStatus: any;
  export type ServiceStatus = typeof ServiceStatus;

  export const DeliveryStatus: any;
  export type DeliveryStatus = typeof DeliveryStatus;

  const _default: any;
  export default _default;
}
