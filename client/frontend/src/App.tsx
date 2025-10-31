import Header from "./components/header"
import Hero from "./components/hero"
import Footer from "./components/footer"

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  )
}
