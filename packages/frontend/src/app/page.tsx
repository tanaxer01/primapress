import Link from "next/link";

export default function LandingPage() {
  return (
    <Link href="/home" prefetch={true}>
      <div className="h-screen flex justify-center items-center text-xl">
        <p className="hover:text-blue-500">primapress.</p>
      </div>
    </Link>
  );
}
