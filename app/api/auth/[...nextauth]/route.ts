import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Admin credentials (should be in environment variables in production)
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "egszmat"; 

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "" },
                password: { label: "Password", type: "password", placeholder: "" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                // Check for admin login
                if (credentials.email === ADMIN_EMAIL) {
                    // Verify admin password
                    const isAdminPasswordCorrect = credentials.password === ADMIN_PASSWORD;
                    
                    if (!isAdminPasswordCorrect) {
                        throw new Error("Invalid admin credentials");
                    }

                    // Find or create admin user
                    let adminUser = await prisma.user.findUnique({
                        where: { email: ADMIN_EMAIL },
                    });

                    if (!adminUser) {
                        adminUser = await prisma.user.create({
                            data: {
                                email: ADMIN_EMAIL,
                                password: await bcrypt.hash(ADMIN_PASSWORD, 10),
                                role: "ADMIN",
                                name: "Admin"
                            }
                        });
                    }

                    return {
                        id: adminUser.id,
                        email: adminUser.email,
                        name: adminUser.name,
                        role: adminUser.role || "ADMIN"
                    };
                }

                // Regular user login
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                // Verify password for regular users
                const passwordsMatch = await bcrypt.compare(
                    credentials.password,
                    user.password!
                );

                if (!passwordsMatch) {
                    throw new Error("Incorrect password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role || "USER" // Default to USER if role not set
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/signin',
        signOut: '/signout'
    },
    secret: process.env.NEXTAUTH_SECRET, // Make sure to set this in your environment variables
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };