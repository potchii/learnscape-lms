import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const prisma =
    global.prisma ||
    new PrismaClient({
        log: ["query", "error", "warn"],
        errorFormat: "pretty",
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

// Gracefully handle hot-reload / connection resets
process.on("beforeExit", async () => {
    await prisma.$disconnect();
});

export default prisma;
