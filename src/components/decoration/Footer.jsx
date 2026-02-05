export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-6 text-center">
      &copy; {new Date().getFullYear()} ScribeSense. All rights reserved.
    </footer>
  );
}