"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [targetUrl, setTargetUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState([]);
  const [toast, setToast] = useState("");

  // Auto-hide toast in 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load all links initially
  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  }

  // Create or reuse link handler
  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/links", {
      method: "POST",
      body: JSON.stringify({ target_url: targetUrl, code }),
    });

    // Case: Custom code exists → 409
    if (res.status === 409) {
      setToast("Custom code already exists!");
      return;
    }

    const data = await res.json();

    // Case: URL already exists → 200
    if (res.status === 200) {
      setToast("URL already exists — showing existing short link.");

      // only add if not already shown
      setLinks((prev) => {
        const exists = prev.find((item) => item.id === data.id);
        if (!exists) return [...prev, data];
        return prev;
      });

      return;
    }

    // Case: New link created → 201
    if (res.status === 201) {
      setToast("Short link created successfully!");

      setLinks((prev) => [...prev, data]);
    }

    setTargetUrl("");
    setCode("");
  }

  async function deleteLink(code) {
    await fetch(`/api/links/${code}`, {
      method: "DELETE",
    });

    setToast("Link deleted.");

    setLinks((prev) => prev.filter((item) => item.code !== code));
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">TinyLink Dashboard</h1>

      {/* Toast Box */}
      {toast && (
        <div className="bg-yellow-200 text-black p-3 rounded mb-4 shadow">
          {toast}
        </div>
      )}

      {/* Create Link Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Enter long URL"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="border px-3 py-2 mr-2 w-64"
        />

        <input
          type="text"
          placeholder="Custom code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border px-3 py-2 mr-2 w-48"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>

      {/* Links List */}
      <h2 className="text-xl font-semibold mb-2">Your Short Links</h2>

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <div>
                <strong>Code:</strong> {link.code}
              </div>
              <div>
                <strong>URL:</strong> {link.target_url}
              </div>
              <div>
                <strong>Clicks:</strong> {link.clicks}
              </div>
            </div>

            <div className="space-x-2">
              <a
                href={`/code/${link.code}`}
                className="text-blue-600 underline"
              >
                Stats
              </a>

              <button
                onClick={() => deleteLink(link.code)}
                className="text-red-600 underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
