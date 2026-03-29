"use client";

import { useCallback, useEffect, useState } from "react";
import {
  User,
  Briefcase,
  Camera,
  Mail,
  Phone,
  Save,
  XCircle,
  Building2,
  Star,
  DollarSign,
  Calendar,
  Shield,
} from "lucide-react";
import WebcamCaptureModal from "@/components/worker/WebcamCaptureModal";
import { useAuth } from "@/app/contexts/AuthContext";

type UserRow = {
  email?: string;
  name?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
};

type WorkerRow = {
  id: string;
  name: string;
  phone: string;
  skill: string;
  dailyWage: number;
  reputation: number;
  status?: string;
  employerName?: string | null;
  memberSince?: string;
};

type Tab = "profile" | "work";

export default function WorkerProfilePage() {
  const { refreshUser } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [data, setData] = useState<{ user: UserRow | null; worker: WorkerRow | null } | null>(
    null
  );
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showCam, setShowCam] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const load = useCallback(() => {
    return fetch("/api/worker/profile", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData({ user: d.user ?? null, worker: d.worker ?? null });
        if (d.user) {
          setName(d.user.name ?? "");
          setPhone(d.user.phone ?? "");
          setBio(d.user.bio ?? "");
          setAvatar(d.user.avatarUrl?.trim() ? d.user.avatarUrl : null);
        }
      });
  }, []);

  useEffect(() => {
    let c = false;
    load()
      .catch((e: Error) => {
        if (!c) setErr(e.message || "Failed to load");
      })
      .finally(() => {});
    return () => {
      c = true;
    };
  }, [load]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be 2MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const saveProfile = async () => {
    setIsSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/worker/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          bio,
          avatarUrl: avatar ?? "",
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Save failed");
      if (d.user) {
        setData((prev) => ({
          user: d.user,
          worker: prev?.worker ?? null,
        }));
        setName(d.user.name ?? name);
        setPhone(d.user.phone ?? phone);
        setBio(d.user.bio ?? bio);
        setAvatar(d.user.avatarUrl?.trim() ? d.user.avatarUrl : null);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await refreshUser();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "work", label: "Work & roster", icon: Briefcase },
  ];

  const worker = data?.worker;
  const memberDate = worker?.memberSince
    ? new Date(worker.memberSince).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account details, photo, and see your roster information.
        </p>
      </div>

      {showSuccess && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <p className="text-sm text-green-700">Changes saved successfully!</p>
          </div>
          <button type="button" onClick={() => setShowSuccess(false)} aria-label="Dismiss">
            <XCircle className="h-4 w-4 text-green-500" />
          </button>
        </div>
      )}

      {err && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {err}
        </p>
      )}

      {!data && !err && <p className="text-gray-500">Loading…</p>}

      {data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-2">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      tab === t.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              {tab === "profile" && (
                <div>
                  <h2 className="mb-1 text-lg font-semibold text-gray-800">
                    Personal information
                  </h2>
                  <p className="mb-6 text-sm text-gray-500">
                    Update your name, contact details, and profile photo. Your email is
                    managed by your account and cannot be changed here.
                  </p>

                  <div className="mb-8">
                    <label className="mb-3 block text-sm font-medium text-gray-700">
                      Profile photo
                    </label>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                      <div className="relative shrink-0">
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white">
                          {avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatar}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>{initials}</span>
                          )}
                        </div>
                        <label
                          htmlFor="worker-avatar-upload"
                          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                        >
                          <Camera className="h-4 w-4 text-gray-600" />
                          <input
                            id="worker-avatar-upload"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFile}
                          />
                        </label>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById("worker-avatar-upload")?.click()
                            }
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
                          >
                            Upload photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCam(true)}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            Take photo
                          </button>
                          {avatar && (
                            <button
                              type="button"
                              onClick={() => setAvatar(null)}
                              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          JPG, PNG or WebP. Max 2MB upload. Camera capture is resized for
                          saving to your profile.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-500">
                        Email (read only)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          readOnly
                          value={data.user?.email ?? ""}
                          className="w-full cursor-not-allowed rounded-lg border border-gray-100 bg-gray-50 pl-10 pr-4 py-2 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell employers a bit about your experience and certifications."
                      className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              )}

              {tab === "work" && (
                <div>
                  <h2 className="mb-1 text-lg font-semibold text-gray-800">
                    Work & roster
                  </h2>
                  <p className="mb-6 text-sm text-gray-500">
                    Details your employer sets on the roster. Contact them to change wage or
                    status.
                  </p>

                  {!worker ? (
                    <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
                      Your account is not linked to a worker profile yet. Ask your employer
                      to add you using your email so assignments and pay sync here.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {worker.employerName && (
                        <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-4">
                          <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Employer
                            </p>
                            <p className="font-semibold text-gray-900">{worker.employerName}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border border-gray-100 p-4">
                          <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <User className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase">Roster name</span>
                          </div>
                          <p className="font-semibold text-gray-900">{worker.name}</p>
                          <p className="mt-1 text-xs text-gray-500">As shown on your crew list</p>
                        </div>
                        <div className="rounded-lg border border-gray-100 p-4">
                          <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <Phone className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase">Roster phone</span>
                          </div>
                          <p className="font-semibold text-gray-900">{worker.phone}</p>
                        </div>
                        <div className="rounded-lg border border-gray-100 p-4">
                          <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <Briefcase className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase">Skill</span>
                          </div>
                          <p className="font-semibold text-gray-900">{worker.skill}</p>
                        </div>
                        <div className="rounded-lg border border-gray-100 p-4">
                          <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase">Daily wage</span>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${worker.dailyWage.toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-lg border border-gray-100 p-4">
                          <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <Star className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase">Reputation</span>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {worker.reputation.toFixed(1)} / 5
                          </p>
                        </div>
                        <div className="rounded-lg border border-gray-100 p-4">
                          <div className="mb-2 flex items-center gap-2 text-gray-500">
                            <Shield className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase">Status</span>
                          </div>
                          <p className="font-semibold text-gray-900">{worker.status ?? "—"}</p>
                        </div>
                        {memberDate && (
                          <div className="rounded-lg border border-gray-100 p-4 sm:col-span-2">
                            <div className="mb-2 flex items-center gap-2 text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span className="text-xs font-medium uppercase">On roster since</span>
                            </div>
                            <p className="font-semibold text-gray-900">{memberDate}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCam && (
        <WebcamCaptureModal
          onCapture={(dataUrl) => setAvatar(dataUrl)}
          onClose={() => setShowCam(false)}
        />
      )}
    </div>
  );
}
