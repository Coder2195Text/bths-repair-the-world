import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data, status } = useSession();
  return (
    <div>
      {status === "authenticated" ? data?.user?.email : "Not logged in"}
      <button
        onClick={() => {
          signIn("google");
        }}
      >
        Login A
      </button>
    </div>
  );
}
