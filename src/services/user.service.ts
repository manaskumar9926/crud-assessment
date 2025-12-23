import prisma from "../db";

class UserService {
    async createUser(data: { email: string; password: string }) {
        console.log("👤 [USER-SERVICE] Creating user:", data.email);
        const result = await prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
        console.log("[USER-SERVICE] User created with ID:", result.id);
        return result;
    }

    async getUserByEmail(email: string) {
        console.log("👤 [USER-SERVICE] Looking up user by email:", email);
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log("👤 [USER-SERVICE] User found:", !!user);
        return user;
    }
}

export default new UserService();
