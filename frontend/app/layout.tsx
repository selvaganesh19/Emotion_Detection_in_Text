import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Emotion Detector in Text',
  description: 'A simple emotion detector in text using Next.js and Python(Transformers).',
  // generator: 'v0.dev',
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
