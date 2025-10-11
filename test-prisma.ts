import prisma from "./src/lib/prisma";

async function main() {
    const users = await prisma.user.findMany();
    console.log(users);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
