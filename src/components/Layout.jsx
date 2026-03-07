import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="theme-transition flex min-h-screen flex-col">
      <Header />
      <main className="mt-14 flex flex-1 flex-col sm:mt-16 lg:mt-18">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
