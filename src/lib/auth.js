import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDb } from "./utils";
import { User } from "./models";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
const dotenv = require('dotenv');
dotenv.config();
const login = async (credentials) => {
  try {
    connectToDb();
    const user = await User.findOne({ username: credentials.username });

    if (!user) throw new Error("Wrong credentials!");

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordCorrect) throw new Error("Wrong credentials!");

    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to login!");
  }
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      clientId: "4b0604f7134f2b599da9",
      clientSecret: "f7d2ca09441dd8ab26f9e35e02b007207f86cb81",
    }),
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: "718373822771-0ubb9tvd67gd739vnqv1b55fudcpv71h.apps.googleusercontent.com",
      clientSecret: "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",
    })
  ],
  // callbacks: {
  //   async signIn({ user, account, profile }) {
  //     if (account.provider === "github") {
  //       connectToDb();
  //       try {
  //         const user = await User.findOne({ email: profile.email });

  //         if (!user) {
  //           const newUser = new User({
  //             username: profile.login,
  //             email: profile.email,
  //             image: profile.avatar_url,
  //           });

  //           await newUser.save();
  //         }
  //       } catch (err) {
  //         console.log(err);
  //         return false;
  //       }
  //     }
  //     return true;
  //   },
  //   ...authConfig.callbacks,
  // },
});