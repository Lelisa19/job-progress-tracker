import { ClipboardCheck, ListTodo, Wallet, BarChart3 } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pt-20">
      <section className="bg-[#0d9488] py-20 md:py-24">
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
    </div>
  );
}
