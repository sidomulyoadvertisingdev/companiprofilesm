export default function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-[#6e6e73] space-y-2">
      <p>&copy; {new Date().getFullYear()} Sidomulyo Advertising</p>
      <p>
        <a href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </a>
      </p>
    </footer>
  );
}
