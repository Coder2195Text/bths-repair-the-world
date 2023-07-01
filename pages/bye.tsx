import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  return (
    <div>
      <button
        onClick={() => {
          signIn("google");
        }}
      >
        Login B
      </button>
    </div>
  );
}
