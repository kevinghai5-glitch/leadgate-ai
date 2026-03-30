export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const res = NextResponse.next();
  // Expose the current pathname to server components via header
  res.headers.set("x-pathname", req.nextUrl.pathname);
  return res;
});
