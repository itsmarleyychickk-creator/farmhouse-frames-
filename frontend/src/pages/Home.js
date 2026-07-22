import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <header className="bg-gradient-to-r from-yellow-50 to-orange-50 py-20 text-center">
        <h1 className="text-5xl font-serif font-bold text-gray-800 mb-4">Farmhouse Frames</h1>
        <p className="text-xl text-gray-600 mb-8">Capturing the rustic beauty of Kentucky</p>
        <Link
          to="/shop"
          className="inline-block bg-red-700 text-white px-8 py-3 rounded font-semibold hover:bg-red-800"
        >
          Shop the Collection
        </Link>
      </header>
      
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">Professional-grade photography on high-quality canvases and home decor.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Kentucky Scenes</h3>
            <p className="text-gray-600">Stunning landscapes from Trigg County, Lake Barkley, and Cadiz.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Rustic Beauty</h3>
            <p className="text-gray-600">Perfect for farmhouse and rustic home decor collections.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
