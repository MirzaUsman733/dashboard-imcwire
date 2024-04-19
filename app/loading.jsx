"use client";
import { InfinitySpin } from "react-loader-spinner";
export default function Loading() {
  return (
    <div className="h-[100vh] flex justify-center items-center w-full">
      <InfinitySpin
        visible={true}
        width="200"
        color="#7E22CE"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
}
