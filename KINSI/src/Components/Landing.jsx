import React, { useState } from 'react';
import logo from '../assets/logo2.png';


function Landing() {
    const [isChatOpen, setIsChatOpen] = useState(false);
  return (
   <>
 
<div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/90 shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="KINSI Logo" className="w-10 h-10" />
            <span className="font-bold text-xl text-red-800">KINSI</span>
          </div>
          <nav className="space-x-6 text-orange-600 font-medium">
            <a href="#" className="hover:text-orange-600">Home</a>
            <a href="#" className="hover:text-orange-600">Services</a>
            <a href="#" className="hover:text-orange-600">Vendors</a>
            <a href="#" className="hover:text-orange-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 px-6 flex flex-col items-center justify-center space-y-20">
      <section className="text-center text-white bg-orange-500/90 p-10 rounded-xl shadow-lg">

          <h1 className="text-4xl font-bold mb-4">Welcome to KINSI</h1>
          <p className="text-lg">Your cultural companion for seamless event planning</p>
        </section>
      </main>


      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full shadow-lg"
        >
          💬
        </button>
        {isChatOpen && (
          <div className="mt-2 w-72 h-96 bg-white bg-opacity-95 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 text-center text-red-800 font-bold border-b">KINSI Chatbot</div>
            <div className="p-4 text-sm text-gray-800 overflow-y-auto h-64">Chat content here...</div>
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full border-t px-3 py-2 focus:outline-none"
            />
          </div>
        )}
      </div>


      {/* Footer */}
      <footer className="bg-white/90 text-center py-6 text-teal-800 font-medium mt-20">
        <p>&copy; 2025 KINSI. All rights reserved.</p>
      </footer>
</div>

   </>
  )
}

export default Landing