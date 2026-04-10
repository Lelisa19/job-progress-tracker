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
        className="scroll-mt-20 border-t border-gray-100 bg-gray-50 py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              About JobTracker
            </h2>
            <p className="text-lg leading-relaxed text-gray-500">
              We are on a mission to bridge the gap between employers and daily
              workers through technology. JobTracker is built for modern job sites,
              prioritizing transparency, efficiency, and fairness.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <span className="text-xl font-bold">E</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  For Employers
                </h3>
              </div>
              <p className="mb-6 leading-relaxed text-gray-600">
                Stop stressing over paper timesheets, delayed reports, and
                manual payroll calculations. JobTracker provides a centralized
                dashboard to track worker attendance, assign tasks in real-time,
                and automate wage distribution based on logged hours.
              </p>
              <ul className="space-y-3 text-sm font-medium text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Real-time workforce monitoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Automated payroll generation
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Detailed task and project reporting
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                  <span className="text-xl font-bold">W</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  For Workers
                </h3>
              </div>
              <p className="mb-6 leading-relaxed text-gray-600">
                Gain complete visibility over your day-to-day assignments and
                accumulated pay. With JobTracker, you can securely check in and
                out, view your assigned tasks instantly, and never have to worry
                about missing or disputed payments.
              </p>
              <ul className="space-y-3 text-sm font-medium text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Transparent tracking of billed hours
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Mobile-friendly check-ins
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Instant access to task assignments
                </li>
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-[#0f172a] p-8 text-center sm:p-12">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Ready to modernize your workflow?
            </h3>
            <p className="mb-8 text-[15px] leading-relaxed text-gray-400">
              Join thousands of contractors and modern workers who are already
              experiencing the benefits of JobTracker.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login?role=employer"
                className="rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Employer Login
              </Link>
              <Link
                href="/login?role=worker"
                className="rounded-lg border border-gray-700 bg-transparent px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Worker Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
