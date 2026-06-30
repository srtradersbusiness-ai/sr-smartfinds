"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { toCsvUrl } from "../lib/sheet";

// Configure this via env var NEXT_PUBLIC_SHEET_CSV_URL (see .env.local.example).
// Falls back to the URL below only if the env var isn't set.
const SHEET_URL =
  process.env.NEXT_PUBLIC_SHEET_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYEofk4d6EqVlf-CckSXiax_8Xp_CnWzexdnECgxuwVd6nV-coTgIseoWB5nQpgmEHXgVDs63bylRE/pubhtml?gid=0&single=true";

export default function Page() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const csvUrl = toCsvUrl(SHEET_URL);

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
          .map((row) => ({
            name: row["Product Name"]?.trim() || "",
            price: row["Price"]?.trim() || "",
            image: row["Image URL"]?.trim() || "",
            link: row["Affiliate Link"]?.trim() || "",
            category: row["Category"]?.trim() || "General",
            description: row["Description"]?.trim() || "",
          }))
          .filter((row) => row.name && row.link);
        setProducts(rows);
      },
      error: (err) => setError(err.message),
    });
  }, []);

  const categories = useMemo(() => {
    if (!products) return [];
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const visible = useMemo(() => {
    if (!products) return [];
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <main className="page">
      <header className="profile">
        <img
          className="avatar"
          src="https://api.dicebear.com/7.x/shapes/svg?seed=simpleghar"
          alt="Profile"
        />
        <h1>SR Smart Finds</h1>
        <p>Simplifying all your home needs</p>
      </header>


      {error && (
        <div className="state error">
          Couldn't load products right now. Please refresh, or check the
          sheet URL is published correctly. ({error})
        </div>
      )}

      {!error && !products && (
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="card-img-wrap skeleton" />
              <div className="card-body">
                <div
                  className="skeleton"
                  style={{ height: 10, width: "40%", borderRadius: 4 }}
                />
                <div
                  className="skeleton"
                  style={{ height: 14, width: "80%", borderRadius: 4 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!error && products && products.length === 0 && (
        <div className="state">
          No products found yet. Add a row to the sheet to see it appear
          here.
        </div>
      )}

      {!error && products && products.length > 0 && (
        <>
          {categories.length > 2 && (
            <div className="filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill${
                    activeCategory === cat ? " active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="grid">
            {visible.map((p, i) => (
              <a
                key={i}
                className="card"
                href={p.link}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
              >
                <div className="card-img-wrap">
                  {p.image && <img src={p.image} alt={p.name} loading="lazy" />}
                  {p.price && <span className="price-tag">{p.price}</span>}
                </div>
                <div className="card-body">
                  <span className="card-category">{p.category}</span>
                  <p className="card-title">{p.name}</p>
                  {p.description && (
                    <p className="card-desc">{p.description}</p>
                  )}
                  <span className="card-cta">View deal →</span>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      <div className="social-row">
        <a
          href="https://www.instagram.com/sr_smartfinds/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTube
        </a>
        <a href="https://sr-smartfinds.com" target="_blank" rel="noopener noreferrer">
          Website
        </a>
      </div>

      <p className="footer-note">
        The products listed on this page contain affiliate links. When you
        purchase any product, SimpleGhar may earn a commission. Questions?
        Write to telugu@simpleghar.com
      </p>
    </main>
  );
}
