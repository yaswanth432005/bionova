import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      industry?: string | null;
      experienceLevel?: string | null;
      gender?: string | null;
    }
  }

  interface User {
    id: string;
    role?: string | null;
    industry?: string | null;
    experienceLevel?: string | null;
    gender?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string | null;
    industry?: string | null;
    experienceLevel?: string | null;
    gender?: string | null;
  }
}
