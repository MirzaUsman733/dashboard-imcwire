"use client";

import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="mt-52">
      <Navbar /> {children}
    </div>
  );
}
