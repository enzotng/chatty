import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    if (params.model === "User") {
        if (params.action === "create" || params.action === "update") {
            const user = params.args.data;
            if (user.firstName && user.lastName) {
                user.fullName = `${user.firstName} ${user.lastName}`;
            }
        }
    }
    return next(params);
});

export default prisma;
