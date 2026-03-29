"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ClipboardCheck,
  ListTodo,
  Wallet,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24 lg:py-28">
        <div className="max-w-xl">
          <h1 className="mb-6 text-[40px] font-black leading-[1.08] tracking-tight text-[#0f172a] md:text-[52px] lg:text-[56px]">
            Manage Daily
            <br />
            Workers Efficiently
          </h1>
          <p className="mb-10 max-w-lg pr-0 text-[17px] leading-relaxed text-gray-500 md:pr-4">
            Streamline your job sites, track attendance accurately, and automate
            payments with the ultimate progress tracker for modern employers and
            diligent workers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/login?role=employer"
              className="inline-block rounded-lg bg-[#2563eb] px-8 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Login as Employer
            </Link>
            <Link
              href="/login?role=worker"
              className="inline-block rounded-lg border-2 border-[#2563eb] bg-white px-8 py-3.5 text-center text-sm font-semibold text-[#2563eb] shadow-sm transition hover:bg-blue-50"
            >
              Login as Worker
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] md:mx-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
            <Image
              src="/dashboard-image.jpg"
              alt="JobTracker dashboard preview"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 560px"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-20 bg-[#0d9488] py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-14 text-center text-3xl font-bold text-white md:text-4xl">
            Everything you need to manage your workforce
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Attendance Tracking",
                desc: "Easily monitor check-ins and check-outs. Keep an accurate record of daily worker hours without manual paperwork.",
                Icon: ClipboardCheck,
              },
              {
                title: "Task Assignment",
                desc: "Allocate daily jobs to specific workers or teams. Track progress in real-time and ensure deadlines are met.",
                Icon: ListTodo,
              },
              {
                title: "Payment Automation",
                desc: "Automatically calculate wages based on tracked hours and assigned rates. Generate precise payroll reports instantly.",
                Icon: Wallet,
              },
              {
                title: "Analytics Dashboard",
                desc: "Get bird's-eye views of project costs, workforce efficiency, and overall productivity with beautiful intuitive charts.",
                Icon: BarChart3,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#ccfbf1] text-[#0f766e]">
                  <feature.Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-[13px] font-medium leading-relaxed text-gray-500">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#fafafa] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
              Trusted by leading contractors
            </h2>
            <p className="text-[15px] text-gray-500">
              See how JobTracker is transforming the way teams manage their daily
              operations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                text: `"JobTracker has completely eliminated our payroll headaches. We used to spend hours verifying timesheets, but now it's all automated and accurate to the minute."`,
                name: "Marcus Jenkins",
                role: "Site Manager, BuildRight Inc.",
                avatar: "https://i.pravatar.cc/128?img=12",
              },
              {
                text: `"The task assignment feature is a game-changer. My crew knows exactly what they need to do every morning before they even arrive on site. Highly recommended."`,
                name: "Sarah Collins",
                role: "Operations Director, PrimeConstruct",
                avatar: "https://i.pravatar.cc/128?img=45",
              },
              {
                text: `"As a worker, it's great to have full transparency over my logged hours and expected pay. No more disputes at the end of the week. It just works."`,
                name: "David Rodriguez",
                role: "Independent Contractor",
                avatar: "https://i.pravatar.cc/128?img=33",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="flex min-h-[260px] flex-col justify-between rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
              >
                <p className="mb-8 text-[14px] font-semibold leading-relaxed text-gray-900">
                  {t.text}
                </p>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {t.name}
                    </div>
                    <div className="text-xs font-medium text-gray-400">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About — anchor for footer; placed after testimonials */}
      <section
        id="about"
        className="scroll-mt-20 border-t border-gray-100 bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            About JobTracker
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-500">
            JobTracker helps employers and daily workers stay aligned: digital
            attendance, clear tasks, and transparent pay—built for modern job sites.
          </p>
        </div>
      </section>
    </div>
  );
}
