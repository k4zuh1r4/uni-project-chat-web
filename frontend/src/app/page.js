'use client'
import { HomeNavbar } from "@/components/navbar"
export default function Home() {
  return (
    <div>
      <HomeNavbar />
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url('gallery2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Chat Application Project</h1>
            <p className="mb-5">
              Group ?
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
}
