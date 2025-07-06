import { Link } from "react-router-dom";
import Footer from "./Footer.js";
import Navbar3 from "./Navbar3.js"; // Optional: add it to the layout if needed

export default function Landing() {
  return (
    <div>
      {/* Optional Navbar */}
      {/* <Navbar3 /> */}

      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 min-h-screen">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          {/* Top decorative blur element */}
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          ></div>

          {/* Main content */}
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-6xl">
                SnapSync - Your Photography Hub
              </h1>
              <p className="mt-6 text-lg leading-8 text-white">
                From portraits to passions, SnapSync connects you with talented photographers who don’t just take pictures but capture your essence, your story, and every moment that matters to you
              </p>

              {/* Call-to-action buttons */}
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  to="/login"
                  className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Are you a Photographer?
                </Link>

                <Link
                  to="/usign"
                  className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Hire a Photographer
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom decorative blur element */}
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          ></div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
