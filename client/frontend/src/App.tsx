import Header from "./components/header"
import Hero from "./components/hero"
import Footer from "./components/footer"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
      <Router> {/* main router area   */}
        <Routes>
          <Route path='hi' element= {<div>Hi</div>}/>
          <Route path='/' element={<Hero/>}/>
        </Routes>
      </Router>

      </main>
      <Footer />
    </div>

  )
}
