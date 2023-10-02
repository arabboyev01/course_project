import { PrismaClient } from '@prisma/client'

declare global {
  const prisma: PrismaClient
}

type PrismaReviewCount = {
  count: number;
};

interface CustomPrismaClient extends PrismaClient {
  review: {
    count(): Promise<PrismaReviewCount>;
  };
}

declare module '@prisma/client' {
  export interface PrismaClient extends CustomPrismaClient {}
}
