import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req, event) {
  const token = await getToken({ req });

  // const match = req.nextUrl.pathname.match(
  //   /^\/dashboard\/warehouses\/([^/]+)\//
  // );
  // const id = match ? match[1] : null;
  // console.log(req.url);
  // if (token && token.user && !token.user.warehouses.includes(id)) {
  //   console.log("in");
  //   return {
  //     redirect: {
  //       destination: "/dashboard",
  //       permanent: false,
  //     },
  //   };
  // }
  // console.log("id: " + id);
  // console.log(id);
  //   console.log(token.user.adminLevel === 1);
  //   if (req.nextUrl.pathname.startsWith("/login") && !!token) {
  //     return NextResponse.redirect(new URL("/dashboard", req.url));
  //   }
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
