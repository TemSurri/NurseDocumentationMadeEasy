import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">NurseAI</h1>

        <nav className="hidden sm:flex space-x-6">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>


      {menuOpen && (
        <nav className="sm:hidden bg-white border-t border-gray-200 animate-fadeIn">
          <div className="flex flex-col space-y-3 p-4">
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
