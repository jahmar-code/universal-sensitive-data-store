// components/Header.tsx

import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">
          <Link href="/">Universal Sensitive Data Store</Link>
        </h1>
        {/* <div>
          <Link href="/" className="mr-4 hover:underline">
            Submit Data
          </Link>
          <Link href="/confirm" className="hover:underline">
            Confirm Data
          </Link>
        </div> */}
      </nav>
    </header>
  );
};

export default Header;
