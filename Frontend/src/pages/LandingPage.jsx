import { Link } from "react-router-dom";


const LandingPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-6 overflow-y-hidden">
      {/* Hero Section */}
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-extrabold text-blue-500 mb-6">
          Welcome to the Future of Voting
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Cast your vote easily and securely. Make your voice count in a fair and transparent election.
        </p>
        <Link
          to="/signup"
          className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
      
      {/* Footer */}
      <footer className="absolute bottom-4 mt-12 text-gray-400">
        <p>&copy; {new Date().getFullYear()} Voting Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
