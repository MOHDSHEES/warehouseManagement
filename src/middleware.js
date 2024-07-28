import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req, event) {
  const token = await getToken({ req });
  const authMiddleware = withAuth({
    callbacks: {
      authorized: async () => {
        // console.log(token.user && token.user.warehouses);
        // if (req.nextUrl.pathname.startsWith("/dashboard/admin")) {
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          // console.log(id);
          // token.user.warehouses.includes(targetId)
          if (token && token.user) return true;
          else return false;
        }
        return !!token;
      },
    },
  });

  // @ts-expect-error
  return authMiddleware(req, event);
}
export const config = { matcher: ["/dashboard/:path*"] };

// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(req) {
//     console.log(req.nextauth.token);
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => token?.role === "admin",
//     },
//   }
// );

// export const config = { matcher: ["/dashboard"] };
