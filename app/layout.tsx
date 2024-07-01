import './globals.css';
import { BoardProvider } from '../context/BoardContext';
import LastVisited from '@/components/lastvisited';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <BoardProvider>{children}</BoardProvider>
        <LastVisited />
      </body>
    </html>
  );
}
