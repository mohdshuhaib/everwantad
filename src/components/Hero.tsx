import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-100">
      <h1 className="text-4xl font-bold text-center">
        Welcome! Make your advertisement ever
      </h1>
      <Link href="/login">
        <p className="mt-4 text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700">
          Buy your space
        </p>
      </Link>
    </div>
  );
}