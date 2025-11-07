import Header from "./components/header"
import Hero from "./components/hero"
import Footer from "./components/footer"
import Interface from "./components/recording_interface"
import Recorder from "./components/recorder"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import About from "./components/about.tsx"

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
      <Router> {/* all da routes */}
        <Routes>
          <Route path='/record' element= {<Interface />}/>
          <Route path='/' element={<Hero/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/r' element={<Recorder/>}/>
        </Routes>
      </Router>

      </main>
      <Footer />
    </div>

  )
}
