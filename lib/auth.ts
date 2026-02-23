import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { stripe } from "@better-auth/stripe";
import { admin as adminPlugin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import prisma from "./prisma";
import Stripe from "stripe";
import { ac, admin, user, editor } from "./permission";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
        editor,
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: async () => {
          const plans = await prisma.plans.findMany();
          return plans.map((plan) => ({
            name: plan.name,
            priceId: plan.priceId,
            limits: plan.limits as Record<string, number>,
          }));
        },
      },
    }),
    nextCookies(),
  ],
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
  subscription: {
    enabled: true,
    plans: async () => {
      const plans = await prisma.plans.findMany();
      return plans.map((plan) => ({
        name: plan.name,
        priceId: plan.priceId,
        limits: plan.limits as Record<string, number>,
      }));
    },
  },
});
