import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PATHFINDER',
  description: 'ស្វែងយល់ពីចំណាប់អារម្មណ៍ ជំនាញសិក្សា និងផ្លូវអាជីពតាមរយៈការវាយតម្លៃដែលមានរចនាសម្ព័ន្ធ។',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="km">
      <body>{children}{/* impeccable-live-start */}
<script src="http://localhost:8400/live.js?token=b082c771-0a6a-401c-865f-c297cb73fca0" defer></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
