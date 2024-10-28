// import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import path from "path";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
	console.log("Call API Scrapper Post");

	const body = await req.json();

	console.log(body);

	const imagePath = path.join(process.cwd(), "public", "chromium/chrome.exe"); // Replace 'image.jpg' with your actual image name

	// chromium.setHeadlessMode = true;
	// chromium.setGraphicsMode = false;

	const { siteUrl } = body;

	//console.log(siteUrl);
	// const PCR = require("puppeteer-chromium-resolver");
	// const options = {};
	// const stats = await PCR(options);

	// Optional: Load any fonts you need. Open Sans is included by default in AWS Lambda instances
	await chromium.font(
		"https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
	);

	const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
	const chromePath = isLocal ? process.env.CHROME_EXECUTABLE_PATH : imagePath; //process.env.CHROME_PACK_URL;
	// chromePath = "/public/chromium";
	console.log(isLocal);
	console.log(chromePath);

	const screenName = "full-page.png";

	const screenPath = path.join(process.cwd(), "public", screenName);

	// const browser = await puppeteer.launch({
	// 	args: isLocal ? puppeteer.defaultArgs() : [...chromium.args, "hide-scrollbars"],
	// 	defaultViewport: chromium.defaultViewport,
	// 	executablePath:
	// 		process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath(chromePath)),
	// 	headless: chromium.headless,
	// 	// ignoreHTTPSErrors: true,
	// });

	const browser = await puppeteer.launch();

	const page = await browser.newPage();
	await page.goto(siteUrl);
	const pageTitle = await page.title();
	await page.screenshot({
		path: screenPath,
		fullPage: true,
	});

	await browser.close();

	// assert.strictEqual(pageTitle, "Example Domain");

	return Response.json({
		test: true,
		pageTitle,
		screenshot: screenName,
	});
}
