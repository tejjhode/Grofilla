import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white border border-gray-200 shadow-md rounded-2xl p-8 md:p-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          About <span className="text-blue-600">Grofilla</span>
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          Welcome to <span className="font-semibold text-blue-600">Grofilla</span>, your smart grocery companion! We are a team of passionate developers and product enthusiasts who believe grocery shopping should be fast, convenient, and delightful.
        </p>

        <p className="text-gray-600 mb-4">
          Our mission is to revolutionize how people shop for groceries by providing a seamless digital experience that connects customers with local stores, offers real-time tracking, and delivers personalized product recommendations powered by AI.
        </p>

        <p className="text-gray-600 mb-4">
          With features like live order tracking, secure payments, instant order history, and a dedicated shopkeeper dashboard, <strong>Grofilla</strong> is built to serve both customers and vendors. We aim to empower local businesses while providing unmatched convenience to our users.
        </p>

        <p className="text-gray-600">
          Thank you for choosing Grofilla. We're excited to be part of your everyday grocery journey.
        </p>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Vision</h2>
          <p className="text-gray-600">
            To become India’s most trusted digital grocery ecosystem — bridging the gap between technology and tradition, one basket at a time.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-gray-600">
            Have feedback, questions, or just want to say hi? Email us at{" "}
            <a href="mailto:support@grofilla.in" className="text-blue-600 hover:underline">
              support@grofilla.in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;