import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '정보보안기사 학습앱',
  description: '정보보안기사 시험 대비 인터랙티브 학습 도구',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
