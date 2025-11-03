import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white border border-gray-200 shadow-lg rounded-3xl p-8 sm:p-10 overflow-hidden"
      >
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4 text-center break-words">
          About This Tool
        </h1>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 text-center break-words overflow-hidden text-balance">
          blah blah blah nurses wtv
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-sky-50 border border-sky-100 rounded-2xl p-5 text-center break-words overflow-hidden"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-2 break-words">
              geaturue
            </h2>
            <p className="text-gray-600 text-sm break-words overflow-hidden">
              egnkekgnvlsjvnislknvjnslvj .
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-sky-50 border border-sky-100 rounded-2xl p-5 text-center break-words overflow-hidden"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-2 break-words">
              Carti
            </h2>
            <p className="text-gray-600 text-sm break-words overflow-hidden">
              waadadadadadada
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-sky-50 border border-sky-100 rounded-2xl p-5 text-center break-words overflow-hidden"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-2 break-words">
              FEature
            </h2>
            <p className="text-gray-600 text-sm break-words overflow-hidden">
              blah bah
            </p>
          </motion.div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              navigate("/record");
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base"
          >
            Try it out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
