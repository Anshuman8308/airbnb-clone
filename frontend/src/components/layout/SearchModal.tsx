"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Users, Sparkles, Calendar } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function SearchModal() {
  const {
    filters,
    updateFilter,
    clearFilters,
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchModalTab,
    openSearchModal,
  } = useSearch();

  const [localDest, setLocalDest] = useState("");
  const [localStart, setLocalStart] = useState("");
  const [localEnd, setLocalEnd] = useState("");

  // Sync from context when modal opens or tab changes
  useEffect(() => {
    if (isSearchModalOpen) {
      setLocalDest(filters.search || filters.city || "");
      setLocalStart(filters.start_date || "");
      setLocalEnd(filters.end_date || "");
    }
  }, [isSearchModalOpen, filters.search, filters.city, filters.start_date, filters.end_date]);

  if (!isSearchModalOpen) return null;

  const handleClose = () => {
    setIsSearchModalOpen(false);
  };

  const handleDestinationSelect = (dest: string) => {
    setLocalDest(dest);
    updateFilter({ search: dest });
    openSearchModal("dates");
  };

  const handleDateSelect = (type: "start" | "end", val: string) => {
    if (type === "start") {
      setLocalStart(val);
      updateFilter({ start_date: val });
    } else {
      setLocalEnd(val);
      updateFilter({ end_date: val });
      if (localStart) {
        openSearchModal("who");
      }
    }
  };

  const currentGuests = filters.guests || 1;
  const adults = Math.max(1, currentGuests); // simplified for this demo
  
  const updateGuests = (increment: number) => {
    const newVal = Math.max(1, adults + increment);
    updateFilter({ guests: newVal });
  };

  const handleSearchClick = () => {
    // Already synced via updateFilter, just close the modal to see results
    setIsSearchModalOpen(false);
  };

  const popularDestinations = [
    { name: "Italy", label: "Lake Como & Amalfi Coast" },
    { name: "Switzerland", label: "Alps & Zermatt" },
    { name: "Greece", label: "Santorini & Oia" },
    { name: "Bali", label: "Ubud & Tropical Villas" },
    { name: "California", label: "Big Sur & Joshua Tree" },
    { name: "France", label: "Paris & Provence" },
    { name: "Japan", label: "Kyoto & Zen Gardens" },
    { name: "Aspen", label: "Colorado Ski Lodges" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center bg-black/25 pt-24 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      {/* Container to prevent clicks from closing */}
      <div
        className="w-full max-w-[850px] relative px-4 sm:px-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Unified Search Bar */}
        <div className="flex items-center w-full h-[66px] rounded-full bg-[#EBEBEB] relative z-20">
          {/* WHERE */}
          <div
            onClick={() => openSearchModal("where")}
            className={`flex-[1.2] flex flex-col h-full justify-center rounded-full pl-8 pr-4 cursor-pointer transition ${
              searchModalTab === "where" ? "bg-white shadow-[0_6px_20px_rgba(0,0,0,0.2)]" : "hover:bg-[#DDDDDD]"
            }`}
          >
            <div className="text-[12px] font-extrabold text-[#222222] tracking-wide">Where</div>
            <input
              type="text"
              placeholder="Search destinations"
              value={localDest}
              onChange={(e) => setLocalDest(e.target.value)}
              className="bg-transparent outline-hidden text-sm font-semibold placeholder:text-gray-400 placeholder:font-normal w-full"
              autoFocus={searchModalTab === "where"}
            />
          </div>

          <div className="w-px h-8 bg-gray-300" />

          {/* WHEN */}
          <div
            onClick={() => openSearchModal("dates")}
            className={`flex-1 flex flex-col h-full justify-center rounded-full px-8 cursor-pointer transition ${
              searchModalTab === "dates" ? "bg-white shadow-[0_6px_20px_rgba(0,0,0,0.2)]" : "hover:bg-[#DDDDDD]"
            }`}
          >
            <div className="text-[12px] font-extrabold text-[#222222] tracking-wide">When</div>
            <div className={`text-sm ${localStart || localEnd ? "font-semibold text-gray-900" : "text-gray-500"}`}>
              {localStart && localEnd
                ? `${localStart.split("-").slice(1).join("/")} - ${localEnd.split("-").slice(1).join("/")}`
                : localStart
                ? `${localStart.split("-").slice(1).join("/")} - Add end`
                : "Add dates"}
            </div>
          </div>

          <div className="w-px h-8 bg-gray-300" />

          {/* WHO & SEARCH BUTTON */}
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button")) return;
              openSearchModal("who");
            }}
            className={`flex-[1.2] flex items-center h-full justify-between rounded-full pl-8 pr-2 cursor-pointer transition ${
              searchModalTab === "who" ? "bg-white shadow-[0_6px_20px_rgba(0,0,0,0.2)]" : "hover:bg-[#DDDDDD]"
            }`}
          >
            <div className="flex flex-col justify-center truncate pr-2 h-full">
              <div className="text-[12px] font-extrabold text-[#222222] tracking-wide">Who</div>
              <div className={`text-sm truncate ${currentGuests ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                {currentGuests} guest{currentGuests !== 1 && "s"}
              </div>
            </div>
            <button
              onClick={handleSearchClick}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E00B41] to-[#FF385C] hover:from-[#D70466] hover:to-[#E00B41] px-6 py-3.5 text-[15px] font-bold text-white shadow-md transition shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline-block">Search</span>
            </button>
          </div>
        </div>

        {/* Popovers */}
        <div className="relative mt-4 z-10 w-full animate-in fade-in slide-in-from-top-4 duration-200">
          {searchModalTab === "where" && (
            <div className="absolute left-0 w-full sm:w-[450px] bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular destinations
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {popularDestinations.map((dest) => (
                  <div
                    key={dest.name}
                    onClick={() => handleDestinationSelect(dest.name)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{dest.name}</div>
                      <div className="text-xs text-gray-500">{dest.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchModalTab === "dates" && (
            <div className="absolute left-1/2 -translate-x-1/2 w-full sm:w-[600px] bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700 mb-6 border-b border-gray-100 pb-4">
                <Calendar className="w-4 h-4 text-[#FF385C]" />
                Select Dates
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-500 text-[10px] font-bold uppercase mb-2">CHECK-IN</label>
                  <input
                    type="date"
                    value={localStart}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleDateSelect("start", e.target.value)}
                    className="w-full text-base font-semibold outline-hidden text-gray-900 border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-gray-900 transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[10px] font-bold uppercase mb-2">CHECK-OUT</label>
                  <input
                    type="date"
                    value={localEnd}
                    min={localStart || new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleDateSelect("end", e.target.value)}
                    className="w-full text-base font-semibold outline-hidden text-gray-900 border border-gray-200 rounded-xl p-3 cursor-pointer hover:border-gray-900 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {searchModalTab === "who" && (
            <div className="absolute right-0 w-full sm:w-[400px] bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <div className="text-base font-bold text-gray-900">Adults</div>
                    <div className="text-sm text-gray-500">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateGuests(-1)}
                      disabled={currentGuests <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:hover:border-gray-300 disabled:cursor-not-allowed transition"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-semibold">{currentGuests}</span>
                    <button
                      onClick={() => updateGuests(1)}
                      disabled={currentGuests >= 16}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Visual stubs for UI completeness */}
                <div className="flex items-center justify-between py-4 opacity-50">
                  <div>
                    <div className="text-base font-bold text-gray-900">Children</div>
                    <div className="text-sm text-gray-500">Ages 2–12</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 cursor-not-allowed">-</button>
                    <span className="w-4 text-center font-semibold">0</span>
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 cursor-not-allowed">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-4 opacity-50">
                  <div>
                    <div className="text-base font-bold text-gray-900">Infants</div>
                    <div className="text-sm text-gray-500">Under 2</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 cursor-not-allowed">-</button>
                    <span className="w-4 text-center font-semibold">0</span>
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 cursor-not-allowed">+</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}