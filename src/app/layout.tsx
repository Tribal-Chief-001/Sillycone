import './globals.css';
import '@xyflow/react/dist/style.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sillycone — Living Silicon Knowledge Graph & Spec Observatory',
  description: 'Autonomous DAG dependency graph, cross-platform benchmark index (Geekbench 6/7, 3DMark, Cinebench), and rumor-to-silicon delta tracker.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080c14] text-slate-100 antialiased silicon-grid">
        {children}
      </body>
    </html>
  );
}
