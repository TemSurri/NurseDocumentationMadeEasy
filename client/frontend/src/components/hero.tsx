import { useNavigate } from 'react-router-dom'

const slogans = ["Smarter notes, calmer shifts, more time for care.",
                  "Helping nurses save time so care always comes first.",
                  "Quick notes, clear minds, better balance.",
                  "The gentle way to finish charting and start resting.",
                  "Notes done right so you can breathe easy.",
                  "A friendly helper for nurses who care deeply.",
                  "Finish your notes fast and keep your focus on people.",
                ]      

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-900 animate-fadeIn">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-blue-700 leading-tight animate-slideUp [animation-delay:0.1s]">
        Simplify Nurse Documentation <br /> with <span className="text-blue-500">AI Assistance</span>
      </h1>
      <p className="mt-6 max-w-2xl text-gray-600 text-lg sm:text-xl animate-slideUp [animation-delay:0.3s]">
       {
       slogans[Math.floor(Math.random()*(slogans.length-0.1))]
       }
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fadeIn [animation-delay:0.5s]">
        <button onClick = {()=> {navigate('/record')}} className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition">
          Try it out
        </button>
        <button onClick = {()=> {navigate('/about')}} className="bg-white text-blue-600 border border-blue-200 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition">
          Learn More
        </button>
      </div>
    </section>
  )
}
