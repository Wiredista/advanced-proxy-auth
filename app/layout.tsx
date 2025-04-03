import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Advanced Proxy Auth',
  description: 'Advanced Proxy Auth is a tool that allows you to create an simple reverse proxy with authentication. It is useful when you want to protect your unsecured services with a simple password.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
