export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transactions/:path*',
    '/masters/:path*',
    '/reports/:path*',
    '/journal/:path*',
    '/ledger/:path*'
  ]
}
