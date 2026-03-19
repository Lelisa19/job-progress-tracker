"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-950 border-t border-gray-900 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 pr-8">
                        <div className="font-bold text-lg text-white mb-4 tracking-tight">JobTracker</div>
                        <p className="text-gray-400 text-[13px] leading-relaxed max-w-xs font-medium">
                            The ultimate workforce management platform for modern construction and contractor teams.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 text-sm">Product</h4>
                        <ul className="space-y-4 text-gray-400 text-[13px] font-medium">
                            <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Security</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 text-sm">Company</h4>
                        <ul className="space-y-4 text-gray-400 text-[13px] font-medium">
                            <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 text-sm">Legal</h4>
                        <ul className="space-y-4 text-gray-400 text-[13px] font-medium">
                            <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex justify-center text-gray-500 font-medium text-[12px]">
                    <p>© 2026 JobTracker. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
