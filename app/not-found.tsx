import { HomeFooter } from "@/components/landing/home-footer";
import { HomeNavbar } from "@/components/landing/home-navbar";

import NotFoundContent from "./not-found-content";

export default function NotFound() {
  return (
    <div className="landing-root flex min-h-full flex-col">
      <HomeNavbar />
      <NotFoundContent />
      <HomeFooter />
    </div>
  );
}
