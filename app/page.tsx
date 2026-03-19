"use client";

import Link from "next/link";
import Navbar from "../components/Navbar"; // Bring in the Navbar component
import Footer from "../components/Footer"; // Bring in the Footer component

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">


      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
          <h1 className="text-[44px] md:text-[56px] font-[900] leading-[1.05] tracking-tight text-[#0f172a] mb-6">
            Manage Daily<br />Workers Efficiently
          </h1>
          <p className="text-gray-500 text-[17px] mb-10 leading-relaxed pr-8">
            Streamline your job sites, track attendance accurately, and automate payments with the ultimate progress tracker for modern employers and diligent workers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/login?role=employer" className="inline-block px-8 py-3.5 bg-[#2563eb] text-white font-medium rounded-md hover:bg-blue-700 transition shadow-sm text-center">
              Login as Employer
            </Link>
            <Link href="/login?role=worker" className="inline-block px-8 py-3.5 bg-white text-gray-800 font-semibold rounded-md border border-gray-200 hover:bg-gray-50 transition shadow-sm text-center">
              Login as Worker
            </Link>
          </div>
        </div>

        {/* Right Side - Dashboard Image */}
        <div className="relative w-[90%] h-[350px] md:h-[450px] rounded-xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
          <img
            src="/dashboard-image.jpg"
            alt="Dashboard Preview"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </section>

      {/* Features Section - Vibrant Teal Background */}
      <section className="bg-[#10b981] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage your workforce
            </h2>
            <p className="text-teal-900 font-medium opacity-80">
              Robust capabilities designed to save you time and keep your projects<br /> running smoothly.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Attendance\nTracking",
                desc: "Easily monitor clock-ins and clock-outs. Keep an accurate record of daily worker hours without manual paperwork.",
                icon: "⏱️"
              },
              {
                title: "Task\nAssignment",
                desc: "Allocate daily jobs to specific workers or teams. Track progress in real-time and ensure deadlines are met.",
                icon: "📋"
              },
              {
                title: "Payment\nAutomation",
                desc: "Automatically calculate wages based on tracked hours and assigned rates. Generate precise payroll reports instantly.",
                icon: "💰"
              },
              {
                title: "Analytics\nDashboard",
                desc: "Get bird's-eye views of project costs, workforce efficiency, and overall productivity with beautiful, intuitive charts.",
                icon: "📊"
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-slate-100 rounded-lg mb-6 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 whitespace-pre-line leading-snug">
                  {feature.title}
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Light Gray */}
      <section className="bg-[#fafafa] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Trusted by leading contractors
            </h2>
            <p className="text-gray-500 text-[15px]">
              See how JobTracker is transforming the way teams manage their daily<br />operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: `"JobTracker has completely eliminated our payroll headaches. We used to spend hours verifying timesheets, but now it's all automated and accurate to the minute."`,
                name: "Marcus Jenkins",
                role: "Site Manager, BuildRight Inc."
              },
              {
                text: `"The task assignment feature is a game-changer. My crew knows exactly what they need to do every morning before they even arrive on site. Highly recommended."`,
                name: "Sarah Collins",
                role: "Operations Director, PrimeConstruct"
              },
              {
                text: `"As a worker, it's great to have full transparency over my logged hours and expected pay. No more disputes at the end of the week. It just works."`,
                name: "David Rodriguez",
                role: "Independent Contractor"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[250px]">
                <p className="text-black font-semibold text-[14px] leading-relaxed mb-8">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-gray-400 text-xs font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
