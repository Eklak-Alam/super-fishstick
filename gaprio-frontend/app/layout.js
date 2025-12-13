import Navbar from '@/components/global/Navbar';
import './globals.css';
import SmoothScroll from '@/components/global/SmoothScroll';
import QueryProvider from '@/providers/QueryProvider';
import Footer from '@/components/global/Footer';

export const metadata = {
  title: 'Gaprio | The AI Workspace',
  description: 'Connect everything. Automate anything.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <SmoothScroll>
            {/* <Navbar /> */}
            {children}
            <Footer />
          </SmoothScroll>
        </QueryProvider>
      </body>
    </html>
  );
}