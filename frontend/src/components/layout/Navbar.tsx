"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Menu,
  User as UserIcon,
  Heart,
  Luggage,
  Home,
  PlusCircle,
  MessageSquare,
  ShieldCheck,
  Sun,
  Moon,
  ArrowRightLeft,
  Globe,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import SearchModal from "./SearchModal";
import IdentityVerificationModal from "@/components/auth/IdentityVerificationModal";

export default function Navbar() {
  const { user, isHost, switchUser, toggleHostMode } = useAuth();
  const { filters, openSearchModal } = useSearch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "Homes";

  const handleTabClick = (tab: string) => {
    const q = new URLSearchParams(searchParams.toString());
    if (tab === "All" || tab === "Homes") {
      q.delete("tab");
    } else {
      q.set("tab", tab);
    }
    router.push(`/?${q.toString()}`, { scroll: false });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("airbnb_theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("airbnb_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("airbnb_theme", "light");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPillLabels = () => {
    const where = filters.search || filters.city || "Anywhere";
    let when = "Any week";
    if (filters.start_date) {
      const s = filters.start_date.split("-").slice(1).join("/");
      const e = filters.end_date ? filters.end_date.split("-").slice(1).join("/") : "";
      when = e ? `${s} - ${e}` : s;
    }
    const who = filters.guests ? `${filters.guests} guest${filters.guests > 1 ? "s" : ""}` : "Add guests";
    const hasActiveFilters = Boolean(filters.search || filters.city || filters.start_date || filters.guests);

    return { where, when, who, hasActiveFilters };
  };

  const pill = getPillLabels();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto max-w-[2520px] xl:px-20 md:px-10 sm:px-2 px-4 py-5">
          <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-start gap-4 relative">
            {/* Logo */}
            <div className="flex flex-1 justify-start items-center h-12">
              <Link href="/" className="flex items-center gap-2 group shrink-0">
              <svg
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="h-8 w-8 fill-[#FF385C] transition-transform group-hover:scale-105"
              >
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.479.96 3.397.086 1.587-.456 3.195-1.503 4.464-1.258 1.524-3.09 2.417-5.068 2.454-2.148.04-4.148-.962-5.419-2.731l-.499-.718-.499.718c-1.271 1.769-3.271 2.771-5.419 2.731-1.978-.037-3.81-.93-5.068-2.454-1.047-1.269-1.589-2.877-1.503-4.464.05-.918.293-1.806.96-3.397l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.241 0-2.28.625-3.391 2.617l-.547 1.053C10.15 10.428 6.046 19.034 5.093 21.258l-.133.326c-.536 1.278-.731 1.98-.769 2.693-.059 1.096.31 2.203 1.033 3.079.88 1.066 2.158 1.688 3.535 1.714 1.65.03 3.23-.748 4.22-2.091l1.02-1.428 1.02 1.428c.99 1.343 2.57 2.121 4.22 2.091 1.377-.026 2.655-.648 3.535-1.714.723-.876 1.092-1.983 1.033-3.079-.038-.713-.233-1.415-.769-2.693l-.133-.326c-.953-2.224-5.057-10.83-6.969-14.588l-.547-1.053C18.28 3.625 17.241 3 16 3zm0 13c2.209 0 4 1.791 4 4 0 1.258-.581 2.38-1.493 3.111l-.229.171-.278.18c-1.205.748-2.795.748-4 0l-.278-.18-.229-.171C12.581 22.38 12 21.258 12 20c0-2.209 1.791-4 4-4zm0 2c-1.105 0-2 .895-2 2 0 .524.202 1.002.535 1.363l.135.132.17.135c.697.492 1.623.492 2.32 0l.17-.135.135-.132C17.798 21.002 18 20.524 18 20c0-1.105-.895-2-2-2z" />
              </svg>
              <span className="text-[22px] font-bold tracking-tight text-[#FF385C] hidden sm:inline-block" style={{ fontFamily: "Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif" }}>
                airbnb
              </span>
              </Link>
            </div>

            {/* Center Nav & Search Pill */}
            <div className="flex flex-col items-center gap-5 relative z-10 w-full max-w-[850px] mx-auto mt-[-10px] md:mt-0 lg:w-[850px]">
              
              {/* Top Navigation */}
              <div className="hidden md:flex items-center gap-8 text-[16px] mb-4 mt-2">
                <button
                  onClick={() => handleTabClick("All")}
                  className={`flex items-center gap-2 pb-2 border-b-[2px] transition cursor-pointer hover:opacity-80 ${activeTab === "All" ? "text-[#222222] font-semibold border-[#222222]" : "text-[#6A6A6A] border-transparent hover:text-[#222222] hover:border-gray-300"}`}
                >
                  <span className="text-xl">🌍</span> All
                </button>
                <button
                  onClick={() => handleTabClick("Homes")}
                  className={`flex items-center gap-2 pb-2 border-b-[2px] transition cursor-pointer hover:opacity-80 ${activeTab === "Homes" ? "text-[#222222] font-semibold border-[#222222]" : "text-[#6A6A6A] border-transparent hover:text-[#222222] hover:border-gray-300"}`}
                >
                  <span className="text-xl">🏡</span> Homes
                </button>
                <button
                  onClick={() => handleTabClick("Experiences")}
                  className={`flex items-center gap-2 pb-2 border-b-[2px] transition cursor-pointer hover:opacity-80 ${activeTab === "Experiences" ? "text-[#222222] font-semibold border-[#222222]" : "text-[#6A6A6A] border-transparent hover:text-[#222222] hover:border-gray-300"}`}
                >
                  <span className="text-xl">🎈</span> Experiences
                </button>
                <button
                  onClick={() => handleTabClick("Services")}
                  className={`flex items-center gap-2 pb-2 border-b-[2px] transition cursor-pointer hover:opacity-80 ${activeTab === "Services" ? "text-[#222222] font-semibold border-[#222222]" : "text-[#6A6A6A] border-transparent hover:text-[#222222] hover:border-gray-300"}`}
                >
                  <span className="text-xl">🛎️</span> Services
                </button>
              </div>

              {/* Substantial Search Bar (Airbnb Desktop Style) */}
              <div
                className="flex w-full items-center rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-100 transition cursor-pointer max-w-[850px] relative z-20 h-[66px]"
              >
                {/* Where Button */}
                <button
                  type="button"
                  onClick={() => openSearchModal("where")}
                  className="flex flex-col flex-[1.2] pl-8 pr-4 h-full justify-center text-left rounded-full hover:bg-gray-200 transition"
                >
                  <div className="text-[12px] font-extrabold text-[#222222] tracking-wide">Where</div>
                  <div className={`text-[14px] truncate mt-0.5 ${filters.search || filters.city ? "text-[#222222] font-semibold" : "text-[#717171]"}`}>{pill.where}</div>
                </button>

                <div className="w-px h-8 bg-gray-300" />

                {/* When Button */}
                <button
                  type="button"
                  onClick={() => openSearchModal("dates")}
                  className="flex flex-col flex-1 px-8 h-full justify-center text-left rounded-full hover:bg-gray-200 transition"
                >
                  <div className="text-[12px] font-extrabold text-[#222222] tracking-wide">When</div>
                  <div className={`text-[14px] truncate mt-0.5 ${filters.start_date ? "text-[#222222] font-semibold" : "text-[#717171]"}`}>{pill.when}</div>
                </button>

                <div className="w-px h-8 bg-gray-300" />

                {/* Who / Guests Button */}
                <div
                  onClick={() => openSearchModal("who")}
                  className="flex items-center flex-[1.2] h-full justify-between pl-8 pr-2 rounded-full hover:bg-gray-200 transition"
                >
                  <div className="flex flex-col text-left truncate pr-2 justify-center h-full">
                    <div className="text-[12px] font-extrabold text-[#222222] tracking-wide">Who</div>
                    <div className={`text-[14px] truncate mt-0.5 ${filters.guests ? "text-[#222222] font-semibold" : "text-[#717171]"}`}>
                      {pill.who}
                    </div>
                  </div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#FF385C] hover:bg-[#D70466] text-white transition shrink-0">
                    <Search className="h-5 w-5 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Nav Controls */}
            <div className="flex flex-1 justify-end items-center gap-1 relative h-12" ref={menuRef}>
              {/* Become a host / Switch to traveling Button */}
              <button
                onClick={toggleHostMode}
                className="hidden md:flex items-center rounded-full px-4 py-2.5 text-[14px] font-semibold text-[#222222] hover:bg-gray-100 transition cursor-pointer"
              >
                {isHost ? "Switch to traveling" : "Become a host"}
              </button>

              {/* Globe Icon */}
              <button className="hidden sm:flex rounded-full p-2.5 text-[#222222] hover:bg-gray-100 transition cursor-pointer" title="Language & Region">
                <Globe className="h-[18px] w-[18px]" />
              </button>

              {/* Authentic Airbnb User Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 rounded-full border border-gray-300 py-1.5 pl-3 pr-1.5 hover:shadow-md transition cursor-pointer bg-white ml-2"
                aria-expanded={isMenuOpen}
              >
                <Menu className="h-[18px] w-[18px] text-[#222222] ml-1" />
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="h-[30px] w-[30px] rounded-full object-cover text-xs"
                  />
                ) : (
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gray-500 text-white">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </button>

              {/* Authentic Airbnb Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-14 w-60 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-gray-100">
                  {/* Mode-Specific Sections */}
                  {isHost ? (
                    /* HOST MODE MENU */
                    <>
                      <div className="px-4 py-2.5 bg-gray-50/70">
                        <p className="text-xs text-gray-500 font-medium">Hosting as</p>
                        <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-1.5 mt-0.5">
                          {user.name}
                          <span className="text-[10px] bg-red-100 text-[#FF385C] font-bold px-1.5 py-0.2 rounded-full">
                            Superhost
                          </span>
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/host/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                        >
                          <Home className="w-4 h-4 text-gray-500" />
                          Host dashboard
                        </Link>
                        <Link
                          href="/host/create"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                        >
                          <PlusCircle className="w-4 h-4 text-gray-500" />
                          Create a new listing
                        </Link>
                        <Link
                          href="/messages"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                        >
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          Messages
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            toggleHostMode();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#FF385C] hover:bg-pink-50/50 transition cursor-pointer"
                        >
                          <ArrowRightLeft className="w-4 h-4 text-[#FF385C]" />
                          Switch to traveling
                        </button>
                      </div>
                    </>
                  ) : (
                    /* GUEST MODE MENU */
                    <>
                      <div className="py-1">
                        <Link
                          href="/trips"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                        >
                          <Luggage className="w-4 h-4 text-gray-600" />
                          Trips
                        </Link>
                        <Link
                          href="/wishlists"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                        >
                          <Heart className="w-4 h-4 text-gray-600" />
                          Wishlists
                        </Link>
                        <Link
                          href="/messages"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                        >
                          <MessageSquare className="w-4 h-4 text-gray-600" />
                          Messages
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            toggleHostMode();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition cursor-pointer"
                        >
                          <Home className="w-4 h-4 text-gray-600" />
                          Airbnb your home
                        </button>
                        <button
                          onClick={() => {
                            setIsIdentityModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Identity verification
                        </button>
                      </div>
                    </>
                  )}

                  {/* Shared Settings & Preferences */}
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs text-[#717171] flex items-center justify-between">
                      <span className="truncate">{user.email}</span>
                      <button
                        onClick={() => {
                          toggleHostMode();
                          setIsMenuOpen(false);
                        }}
                        className="text-[#FF385C] font-semibold hover:underline cursor-pointer ml-2 shrink-0"
                      >
                        Switch user
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Search Modal */}
      <SearchModal />

      {/* Identity Verification Modal */}
      <IdentityVerificationModal
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
      />
    </>
  );
}