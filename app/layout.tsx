export const metadata = {
  title: 'Briefing · Ana Fachone Marketing Digital',
  description: 'Formulário de briefing para clientes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, background: '#F6F1EC', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
