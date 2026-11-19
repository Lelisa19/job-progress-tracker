import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-20">
      <section className="bg-gray-50 py-20 md:py-24">
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
        </div>
      </section>
    </div>
  );
}
