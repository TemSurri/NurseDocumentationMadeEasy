import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-3xl bg-white border border-gray-200 shadow-xl rounded-3xl p-8 sm:p-12"
      >

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
          About NurseEasy AI
        </h1>


        <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-center mb-10">
          NurseEasy AI turns spoken audio into clear nursing notes using a simple browser-based recorder and cloud AI. 
          It works on any modern phone or computer with no downloads.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-sky-50 border border-sky-100 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-3 text-center">
              Why We Built It
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-center">
              Nurses spend a lot of time typing notes, and many existing tools are complicated or 
              hard to fit into daily workflows, especially at the bedside of a patient.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-sky-50 border border-sky-100 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-3 text-center">
              Privacy
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-center">
              All data sent between your browser, our server, and AI services is encrypted over
              HTTPS. No audio, transcripts, or personal data are ever stored. 
              
              However since the system does not include secure user accounts, it is still intended only for demonstration and hackathon
              use.
            </p>
          </motion.div>
        </div>

    
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/record")}
            className="bg-blue-600 text-white px-10 py-3 rounded-full font-medium hover:bg-blue-700 transition duration-200 text-base shadow-md"
          >
            Try It Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
