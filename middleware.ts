export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|about|manifest.webmanifest|icon-.*\\.png|screenshots/|sw\\.js|workbox-.*\\.js|swe-worker-.*\\.js).*)",
  ],
};
