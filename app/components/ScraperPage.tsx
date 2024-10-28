"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function ScraperPage() {
	const [siteUrl, setSiteUrl] = useState("https://myblog.laquocthinh.com/");
	const [loading, setLoading] = useState(false);
	const [result, setResults] = useState<any>();

	async function handleOnClick(e: any) {
		e.preventDefault();
		setLoading(true);

		setResults(null);

		const results = await fetch("/api/scraper", {
			method: "POST",
			body: JSON.stringify({
				siteUrl,
			}),
		})
			.then((r) => r.json())
			.finally(() => setLoading(false));

		setResults(results);
	}

	return (
		<div className="scraper-content text-center">
			<div className="max-w-2xl">
				<h1 className="text-5xl font-bold mb-8">Let&apos;s scrape something!</h1>
				<p className="mb-2">Click the button to test out your new scraper.</p>

				<form
					onSubmit={handleOnClick}
					className="form flex gap-2 justify-center items-center"
				>
					<div className="form-item flex flex-1 items-center gap-2">
						<label htmlFor="siteUrl" className="form-label">
							Site Url:
						</label>
						<input
							type="text"
							value={siteUrl}
							onChange={(e) => setSiteUrl(e.target.value)}
							placeholder="Enter site URL"
							className="form-input flex-1 h-12 border rounded-lg px-3 py-1"
						/>
					</div>
					<button
						className="btn btn-primary min-w-40 disabled:!opacity-70 "
						type="submit"
						disabled={loading}
						onClick={handleOnClick}
					>
						{loading ? "Scraping" : "Scraper Data"}
					</button>
				</form>

				{result && (
					<div className="flex flex-col gap-10 mt-10">
						<pre className="bg-zinc-200 text-left py-4 px-5 rounded overflow-x-auto">
							<code>{JSON.stringify(result, undefined, 2)}</code>
						</pre>

						<div className="screen w-full">
							<Image
								src={result?.screenshot || "/test.png"}
								alt="screenshot"
								width={1920}
								height={1080}
								unoptimized
								className="w-full max-h-none h-auto"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
