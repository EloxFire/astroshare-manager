import type { FirebaseTimestamp } from "./FirebaseTimestamp";

export const UserRoles = {
  ADMIN: 'admin',
  MEMBER: 'member',
  GUEST: 'guest',
  BANNED: 'banned',
  SUBSCRIBER: 'subscriber',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export type User = {
  email: string;
  role: UserRole;
  downloadsCount: number;
  downloadsHistory: string[];
  uid: string;
  subscriptionDate?: Date;
  subscription?: string;
  subscriptionName?: string;
  subscriptionType?: string;
  subscriptionRenewal?: Date;
  subscriptionCategory?: string;
  subscriptionId?: string;
  handCanceledSubscription?: boolean;
  subscriptionCancelledAt?: Date;
  lastSubscriptionDate?: Date;
  firstName?: string;
  lastName?: string;
  username?: string;
  birthdate?: Date;
  ref?: string;
  createdAt?: FirebaseTimestamp;
  updatedAt?: FirebaseTimestamp;
};
