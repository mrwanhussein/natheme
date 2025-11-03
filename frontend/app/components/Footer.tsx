// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-[#E7FFCF]/80">
      <div className="container-md">
        © {new Date().getFullYear()} Natheme · All rights reserved
      </div>
    </footer>
  );
}
