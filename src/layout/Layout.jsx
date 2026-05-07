import Footer from '../widgets/Footer/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}