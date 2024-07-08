import NextAuth from "next-auth";
// import authOptions from "./options";

import dbConnect from "@/lib/mongoose";
// import jobUserModel from "@/models/jobUserModel";
// import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import companyModel from "@/models/companyModel";
import userModel from "@/models/userModel";
// import WarehouseModel from "@/models/wareHouseModels";
import bcrypt from "bcryptjs";
// import dbConnect from "../../lib/mongoose";
// import GithubProvider from "next-auth/providers/github"

const authOptions = {
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Password",
        },
      },
      async authorize(credentials, req) {
        await dbConnect();

        // const user = await userModel.findOne(
        //   {
        //     email: credentials.email,
        //     password: credentials.password,
        //   },
        //   {
        //     password: 0,
        //   }
        // );

        const user = await userModel.findOne({
          email: credentials.email,
          status: 1,
        });
        if (!user) {
          return null;
        }
        // console.log(user);

        // Check if password matches
        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) {
          return null;
        }
        const userResponse = user.toObject();
        delete userResponse.password;

        if (user && user.email && isMatch) {
          return userResponse;
        }
        // Return null if user data could not be retrieved

        return null;
        // return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, session, trigger }) => {
      if (trigger === "update") {
        token.user = session;
      }
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        // token.role = user.role;
        // token.email = user.email;
        token.user = user;
        // token.accessToken = user.token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Send properties to the client, like an access_token from a provider.
      // session.user.role = token.role;
      session.user = token.user;
      // session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
