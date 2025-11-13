export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Nurse AI Documentation Tool — Built by Tem Batsuuri.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-blue-600">Privacy</a>
          <a href="#" className="hover:text-blue-600">Terms</a>
          <a href="#" className="hover:text-blue-600">Support</a>
        </div>
      </div>
    </footer>
  )
}
