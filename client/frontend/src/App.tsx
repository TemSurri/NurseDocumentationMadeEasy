import Header from "./components/header"
import Hero from "./components/hero"
import Footer from "./components/footer"
import Interface from "./components/recording_interface"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";


export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
      <Router> {/* all da routes */}
        <Routes>
          <Route path='/record' element= {<Interface />}/>
          <Route path='/' element={<Hero/>}/>
        </Routes>
      </Router>

      </main>
      <Footer />
    </div>

  )
}
