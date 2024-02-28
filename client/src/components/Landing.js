import {Link} from "react-router-dom";
import Footer from "./Footer.js";

import Navbar3 from "./Navbar3.js";

export default function Landing() {

    return (
      <div>
       
      <div
        className="bg-cover bg-center min-h-screen"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/Images/start-2.png)`, // Updated the image path
        }}s
      >
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          ></div>
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-6xl">
                SnapSync - Your Photography Hub
              </h1>
              <p className="mt-6 text-lg leading-8 text-white">
              The ultimate photography hub, where photographers of all levels can store, share, and showcase their work while connecting with a vibrant community of fellow enthusiasts.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
  Are you a Photographer?
</Link>

<Link to="/usign" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
Hire a Photographer
</Link>
                  
          
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          ></div>
        </div>
      </div>

      
      
      <Footer/>
       
      </div>
    );
  }
  