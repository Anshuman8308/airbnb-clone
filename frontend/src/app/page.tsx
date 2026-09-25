"use client";

import React, { useState, useEffect, useCallback } from "react";
import CategoriesBar from "@/components/layout/CategoriesBar";
import ListingGrid from "@/components/listings/ListingGrid";
import MapView from "@/components/map/MapView";
import { fetchListings } from "@/lib/api";
import { ListingCard, SearchFilterState } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import { Map, List, ChevronLeft, ChevronRight, X, Search, RotateCcw, Star } from "lucide-react";
import { FALLBACK_LISTINGS } from "@/data/fallbackData";
import { experiences, services } from "@/data/tabsData";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HomeContent() {
  const { user } = useAuth();
  const { filters, updateFilter, clearFilters, openSearchModal } = useSearch();

  const [listings, setListings] = useState<ListingCard[]>(FALLBACK_LISTINGS.slice(0, 12));
  const [totalListings, setTotalListings] = useState(FALLBACK_LISTINGS.length);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(FALLBACK_LISTINGS.length / 8));
  const limit = 12;

  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "Homes";

  const [selectedExp, setSelectedExp] = useState<any>(null);
  const [selectedSrv, setSelectedSrv] = useState<any>(null);

  // Clear detail views when tab changes
  useEffect(() => {
    setSelectedExp(null);
    setSelectedSrv(null);
  }, [activeTab]);

  // Handle browser Back button for detail views
  useEffect(() => {
    const handlePopState = () => {
      setSelectedExp(null);
      setSelectedSrv(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openExp = (exp: any) => {
    window.history.pushState({ detail: true }, "");
    setSelectedExp(exp);
  };

  const openSrv = (srv: any) => {
    window.history.pushState({ detail: true }, "");
    setSelectedSrv(srv);
  };

  const closeDetail = () => {
    window.history.back();
  };

  const loadListings = useCallback(
    async (currentFilters: SearchFilterState, pageNum = 1) => {
      setLoading(true);
      try {
        const res = await fetchListings(currentFilters, user.id, pageNum, limit);
        setListings(res.listings);
        setTotalListings(res.total);
        setTotalPages(res.total_pages);
      } catch (err) {
        console.warn("Could not sync with backend, retaining stays:", err);
      } finally {
        setLoading(false);
      }
    },
    [user.id]
  );

  // Fetch whenever filters or page changes
  useEffect(() => {
    loadListings(filters, page);
  }, [filters, page, loadListings]);

  // Reset to page 1 whenever search criteria change
  const handleCategorySelect = (category: string) => {
    setPage(1);
    updateFilter({ category: category === "All" ? undefined : category });
  };

  const handleApplyFilters = (newFilters: Partial<SearchFilterState>) => {
    setPage(1);
    updateFilter(newFilters);
  };

  const handleRemoveFilter = (key: keyof SearchFilterState) => {
    setPage(1);
    if (key === "start_date") {
      updateFilter({ start_date: undefined, end_date: undefined });
    } else {
      updateFilter({ [key]: undefined });
    }
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.city ||
    filters.guests ||
    filters.start_date ||
    filters.min_price ||
    filters.max_price ||
    filters.property_type ||
    (filters.amenities && filters.amenities.length > 0)
  );

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Categories Bar (Only for Homes) */}
      {activeTab === "Homes" && (
        <CategoriesBar
          activeCategory={filters.category || "All"}
          onSelectCategory={handleCategorySelect}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      )}

      {/* Main Content Area */}
      <div className="mx-auto max-w-[2520px] xl:px-20 md:px-10 sm:px-2 px-4">
        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="pt-4 pb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 mr-1">Active filters:</span>

            {filters.search && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-full border border-gray-200">
                Destination: &ldquo;{filters.search}&rdquo;
                <button
                  onClick={() => handleRemoveFilter("search")}
                  className="hover:text-red-500 cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.guests && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-full border border-gray-200">
                Guests: {filters.guests}+
                <button
                  onClick={() => handleRemoveFilter("guests")}
                  className="hover:text-red-500 cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.start_date && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-full border border-gray-200">
                Dates: {filters.start_date} {filters.end_date ? `→ ${filters.end_date}` : ""}
                <button
                  onClick={() => handleRemoveFilter("start_date")}
                  className="hover:text-red-500 cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {(filters.min_price || filters.max_price) && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-full border border-gray-200">
                Price: ${filters.min_price || 0} - ${filters.max_price || "Any"}
                <button
                  onClick={() => {
                    handleRemoveFilter("min_price");
                    handleRemoveFilter("max_price");
                  }}
                  className="hover:text-red-500 cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.property_type && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-full border border-gray-200">
                Type: {filters.property_type}
                <button
                  onClick={() => handleRemoveFilter("property_type")}
                  className="hover:text-red-500 cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setPage(1);
                clearFilters();
              }}
              className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1 ml-2 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset all
            </button>
          </div>
        )}

        {/* --- Experiences Tab --- */}
        {activeTab === "Experiences" && !selectedExp && (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Unforgettable activities hosted by locals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="group cursor-pointer flex flex-col" onClick={() => openExp(exp)}>
                  <div className="aspect-[4/5] relative rounded-2xl overflow-hidden mb-3">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <button className="absolute top-3 right-3 p-2 text-white hover:scale-110 transition cursor-pointer">
                      <svg viewBox="0 0 32 32" className="w-6 h-6 fill-black/30 stroke-white stroke-[2px]"><path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 7.97l-2.05-1.92A6.98 6.98 0 0 0 9 4c-3.86 0-7 3.14-7 7 0 7 7 12.27 14 17z" /></svg>
                    </button>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-semibold text-gray-900 truncate">{exp.location}</div>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" /> {exp.rating}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{exp.title}</div>
                  <div className="text-sm font-semibold text-gray-900 mt-1">From ${exp.price} <span className="font-normal text-gray-500">/ person</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Services Tab --- */}
        {activeTab === "Services" && !selectedSrv && (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Premium services for your perfect stay</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {services.map((srv) => (
                <div key={srv.id} className="group cursor-pointer flex flex-col" onClick={() => openSrv(srv)}>
                  <div className="aspect-square relative rounded-2xl overflow-hidden mb-3">
                    <img src={srv.image} alt={srv.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <button className="absolute top-3 right-3 p-2 text-white hover:scale-110 transition cursor-pointer">
                      <svg viewBox="0 0 32 32" className="w-6 h-6 fill-black/30 stroke-white stroke-[2px]"><path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 7.97l-2.05-1.92A6.98 6.98 0 0 0 9 4c-3.86 0-7 3.14-7 7 0 7 7 12.27 14 17z" /></svg>
                    </button>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-semibold text-gray-900 truncate">{srv.title}</div>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" /> {srv.rating}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 truncate">By {srv.provider}</div>
                  <div className="text-sm font-semibold text-gray-900 mt-1">Starting at ${srv.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings or Map View (Homes Only) */}
        {activeTab === "Homes" && showMap && (
          <div className="py-6">
            <MapView listings={listings} height="75vh" zoom={3} />
          </div>
        )}

        {activeTab === "Homes" && !showMap && listings.length === 0 && !loading && (
          /* Empty Search Results State */
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-[#FF385C] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No stays found</h3>
            <p className="text-sm text-gray-500 mb-6">
              We couldn&apos;t find any properties matching your current search criteria. Try changing your destination, reducing the guest count, or clearing filters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => openSearchModal("where")}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold hover:bg-gray-800 transition cursor-pointer"
              >
                Change search
              </button>
              <button
                onClick={() => {
                  setPage(1);
                  clearFilters();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-gray-300 text-gray-800 text-xs font-bold hover:border-black transition cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {activeTab === "Homes" && !showMap && (listings.length > 0 || loading) && (
          <>
            <ListingGrid
              listings={listings}
              loading={loading}
              onReset={() => {
                setPage(1);
                clearFilters();
              }}
            />

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:border-black disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                          page === p
                            ? "bg-black text-white"
                            : "border border-gray-200 text-gray-700 hover:border-black"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:border-black disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating View Toggle Button (Map / List) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-xs font-bold text-white shadow-xl hover:scale-105 hover:bg-black transition cursor-pointer"
        >
          {showMap ? (
            <>
              <List className="h-4 w-4" />
              <span>Show list</span>
            </>
          ) : (
            <>
              <Map className="h-4 w-4" />
              <span>Show map</span>
            </>
          )}
        </button>
      </div>

      {/* Full-Page Experience Detail View */}
      {selectedExp && (
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-20 bg-white min-h-screen">
          <button 
            onClick={closeDetail} 
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline mb-6 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Experiences
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedExp.title}</h1>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-6 underline">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current" /> {selectedExp.rating}</span>
            <span className="text-gray-300 no-underline">•</span>
            <span>{selectedExp.location}</span>
          </div>

          <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden mb-12">
            <img src={selectedExp.image} alt={selectedExp.title} className="w-full h-full object-cover" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Experience hosted by {selectedExp.host}</h2>
                  <div className="text-gray-500 mt-1">{selectedExp.duration} · Hosted in English and Local Language</div>
                </div>
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=H&background=random" alt="Host" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="py-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's included</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✓</div><span>Expert local guide</span></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✓</div><span>All equipment provided</span></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✓</div><span>Authentic experience</span></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✓</div><span>Memorable moments</span></div>
                </div>
              </div>

              <div className="py-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About this experience</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{selectedExp.description}</p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Join us for an unforgettable journey where you will discover hidden gems and immerse yourself in the local culture. Our carefully curated experience ensures that you get the most authentic taste of the destination.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Perfect for couples, families, and solo travelers alike. No prior experience is required, just bring your enthusiasm and a sense of adventure!
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-32 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
                <div className="text-2xl font-bold text-gray-900 mb-1">${selectedExp.price} <span className="text-base font-normal text-gray-500">/ person</span></div>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 mb-6">
                  <Star className="w-4 h-4 fill-current" /> {selectedExp.rating}
                </div>
                
                <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
                  <div className="flex border-b border-gray-300">
                    <div className="flex-1 p-3 border-r border-gray-300">
                      <div className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">Dates</div>
                      <div className="text-sm text-gray-500">Select date</div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">Guests</div>
                    <div className="text-sm text-gray-900">1 guest</div>
                  </div>
                </div>
                
                <button 
                  className="w-full py-3.5 rounded-xl bg-[#FF385C] text-white font-bold text-lg hover:bg-[#D70466] transition cursor-pointer"
                  onClick={() => alert('Demo: Reserve functionality')}
                >
                  Reserve experience
                </button>
                <div className="text-center text-sm text-gray-500 mt-4">You won't be charged yet</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Page Service Detail View */}
      {selectedSrv && (
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-20 bg-white min-h-screen">
          <button 
            onClick={closeDetail} 
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline mb-6 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Services
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedSrv.title}</h1>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-6 underline">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current" /> {selectedSrv.rating}</span>
            <span className="text-gray-300 no-underline">•</span>
            <span>{selectedSrv.location}</span>
          </div>

          <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden mb-12 bg-gray-100">
            <img src={selectedSrv.image} alt={selectedSrv.title} className="w-full h-full object-cover" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Professional Service provided by {selectedSrv.provider}</h2>
                  <div className="text-gray-500 mt-1">Highly rated · Premium Quality</div>
                </div>
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=P&background=random" alt="Provider" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="py-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's included</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✓</div><span>Certified professional</span></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✓</div><span>Flexible scheduling</span></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✓</div><span>Satisfaction guarantee</span></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✓</div><span>All taxes & fees</span></div>
                </div>
              </div>

              <div className="py-8 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About this service</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{selectedSrv.description}</p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Enhance your stay with our premium professional services. We partner with the best local providers to ensure you receive top-tier treatment without having to lift a finger.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Available directly at your accommodation or at select premium locations. Please book at least 24 hours in advance to guarantee availability.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-32 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
                <div className="text-2xl font-bold text-gray-900 mb-1">${selectedSrv.price} <span className="text-base font-normal text-gray-500">starting price</span></div>
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 mb-6">
                  <Star className="w-4 h-4 fill-current" /> {selectedSrv.rating}
                </div>
                
                <div className="border border-gray-300 rounded-xl overflow-hidden mb-4 p-3">
                    <div className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">Service Date</div>
                    <div className="text-sm text-gray-500 mt-1">Select requested date</div>
                </div>
                
                <button 
                  className="w-full py-3.5 rounded-xl bg-[#222222] text-white font-bold text-lg hover:bg-black transition cursor-pointer"
                  onClick={() => alert('Demo: Request Service functionality')}
                >
                  Request service
                </button>
                <div className="text-center text-sm text-gray-500 mt-4">Provider will confirm within 2 hours</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeContent />
    </Suspense>
  );
}