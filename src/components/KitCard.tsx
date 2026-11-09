
"use client";

import { useMemo, useState } from "react";
import { Search, Package, X, SlidersHorizontal } from "lucide-react";
import KitCard from "@/components/KitCard";
import { kits } from "@/data/kits";

type AvailabilityFilter = "all" | "available" | "unavailable";

export default function KitsPage() {
  const [search, setSearch] = useState("");
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("all");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const categories = useMemo(
    () => ["All", ...new Set(kits.map((kit) => kit.category).filter(Boolean))],
    []
  );

  const filteredKits = useMemo(() => {
    let result = [...kits];

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((kit) =>
        [
          kit.name,
          kit.subtitle,
          kit.category,
          ...kit.items,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    if (availability === "available") {
      result = result.filter((kit) => kit.isAvailable);
    } else if (availability === "unavailable") {
      result = result.filter((kit) => !kit.isAvailable);
    }

    if (category !== "All") {
      result = result.filter((kit) => kit.category === category);
    }

    switch (sort) {
      case "low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort(
          (a, b) => Number(b.isAvailable) - Number(a.isAvailable)
        );
    }

    return result;
  }, [search, availability, category, sort]);

  const resetFilters = () => {
    setSearch("");
    setAvailability("all");
    setCategory("All");
    setSort("featured");
  };

  const hasActiveFilters =
    search !== "" ||
    availability !== "all" ||
    category !== "All" ||
    sort !== "featured";

  return (
    <main className="min-h-screen bg-[#F5FAF5] pb-24">
      {/* Hero */}
      <section className="border-b border-[#DFEEE3] bg-gradient-to-br from-[#E8F5E9] via-[#F1FAF3] to-[#D5F0DF]">
        <div className="mx-auto max-w-[1440px] px-4 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#B7E4C7] bg-white/80 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#168447] shadow-sm sm:text-xs">
              <Package size={14} />
              Rashid Mega Mart
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-[#202B24] sm:text-4xl lg:text-5xl">
              Grocery{" "}
              <span className="text-[#168447]">Combo Kits</span>
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#68756B] sm:text-base sm:leading-7">
              Smart grocery combinations for your everyday needs.
              Choose your favourite kit and shop with ease.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="rounded-xl border border-white bg-white/85 px-4 py-2.5 shadow-sm">
                <p className="text-lg font-black text-[#075C2B]">
                  {kits.length}
                </p>
                <p className="text-[10px] font-semibold text-[#68756B]">
                  Total Kits
                </p>
              </div>

              <div className="rounded-xl border border-white bg-white/85 px-4 py-2.5 shadow-sm">
                <p className="text-lg font-black text-[#168447]">
                  {kits.filter((kit) => kit.isAvailable).length}
                </p>
                <p className="text-[10px] font-semibold text-[#68756B]">
                  Available Now
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* Search + Sort */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#168447]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search grocery kits..."
              aria-label="Search grocery kits"
              className="h-12 w-full rounded-xl border border-[#DFEEE3] bg-white pl-11 pr-10 text-sm text-[#202B24] outline-none transition placeholder:text-[#98A69C] focus:border-[#168447] focus:ring-4 focus:ring-[#168447]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#68756B] hover:bg-[#E8F5E9]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={17}
              className="shrink-0 text-[#168447]"
            />

            <label htmlFor="kit-sort" className="sr-only">
              Sort kits
            </label>

            <select
              id="kit-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-12 min-w-0 flex-1 rounded-xl border border-[#DFEEE3] bg-white px-3 text-xs font-semibold text-[#202B24] outline-none focus:border-[#168447] sm:min-w-[190px] sm:text-sm"
            >
              <option value="featured">Featured Kits</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Availability */}
        <div className="mt-5">
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-[#68756B]">
            Availability
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "All Kits", value: "all" },
              { label: "In Stock", value: "available" },
              { label: "Out of Stock", value: "unavailable" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setAvailability(item.value as AvailabilityFilter)
                }
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                  availability === item.value
                    ? "border-[#168447] bg-[#168447] text-white shadow-sm"
                    : "border-[#DFEEE3] bg-white text-[#53665A] hover:border-[#95D5B2] hover:bg-[#F1FAF3]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        {categories.length > 1 && (
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-[#68756B]">
              Browse Categories
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                    category === item
                      ? "border-[#075C2B] bg-[#E8F5E9] text-[#075C2B]"
                      : "border-[#DFEEE3] bg-white text-[#68756B] hover:border-[#95D5B2]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-5 mt-7 flex items-center justify-between gap-3 border-b border-[#DFEEE3] pb-4">
          <div>
            <h2 className="text-lg font-black text-[#202B24] sm:text-xl">
              Explore Our Kits
            </h2>
            <p className="mt-1 text-xs text-[#68756B]">
              Showing {filteredKits.length} of {kits.length} kits
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-[#168447] transition hover:bg-[#E8F5E9]"
            >
              <X size={14} />
              Reset
            </button>
          )}
        </div>

        {/* 4 Column Responsive Grid */}
        {filteredKits.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {filteredKits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#B7E4C7] bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#168447]">
              <Package size={30} />
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-[#202B24]">
              No kits found
            </h3>

            <p className="mt-2 text-sm text-[#68756B]">
              Try another search or reset your filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-[#168447] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#075C2B]"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
