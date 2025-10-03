import React from 'react';
import { Heart, Leaf, Award, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[400px] bg-gradient-to-br from-rose-500 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Nycha Beauty</h1>
            <p className="text-xl text-rose-50 max-w-3xl mx-auto">
              Empowering natural beauty through premium, sustainable products
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Nycha Beauty was founded in 2020 with a simple mission: to create beauty products
                  that enhance natural beauty while respecting both people and planet.
                </p>
                <p>
                  We believe that true beauty comes from within, and our products are designed to
                  nourish, protect, and enhance your natural radiance. Every formulation is
                  carefully crafted with premium, ethically-sourced ingredients.
                </p>
                <p>
                  Today, we're proud to serve thousands of customers worldwide who share our
                  commitment to conscious beauty and sustainable living.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.pexels.com/photos/3738673/pexels-photo-3738673.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Beauty products"
                className="rounded-xl shadow-lg h-64 object-cover"
              />
              <img
                src="https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Skincare"
                className="rounded-xl shadow-lg h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                Eco-friendly practices from sourcing to packaging, minimizing our environmental
                impact.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cruelty-Free</h3>
              <p className="text-gray-600">
                Never tested on animals. We're committed to ethical beauty without compromise.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Only the finest ingredients, rigorously tested for safety and effectiveness.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Inclusivity</h3>
              <p className="text-gray-600">
                Beauty products for everyone, celebrating diversity and individual expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-rose-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Sustainability Commitment</h2>
            <p className="text-lg text-rose-50 max-w-3xl mx-auto">
              We're dedicated to making beauty sustainable for future generations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Eco-Packaging</h3>
              <p className="text-rose-50">
                100% recyclable and biodegradable packaging materials. We've eliminated single-use
                plastics from our supply chain.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Carbon Neutral</h3>
              <p className="text-rose-50">
                Our operations are carbon neutral. We offset our emissions through verified
                environmental projects.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Ethical Sourcing</h3>
              <p className="text-rose-50">
                We partner with suppliers who share our values, ensuring fair wages and ethical
                labor practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">By The Numbers</h2>
            <p className="text-lg text-gray-600">Our impact and achievements</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-rose-500 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-rose-500 mb-2">100%</div>
              <div className="text-gray-600">Cruelty-Free</div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-rose-500 mb-2">85%</div>
              <div className="text-gray-600">Natural Ingredients</div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-rose-500 mb-2">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
