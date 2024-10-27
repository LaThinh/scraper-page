import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

export async function POST(req: Request) {
	console.log("Call API Scrapper Post");

	const body = await req.json();

	console.log(body);

	chromium.setHeadlessMode = true;
	chromium.setGraphicsMode = false;

	const { siteUrl } = body;

	//console.log(siteUrl);

	// Optional: Load any fonts you need. Open Sans is included by default in AWS Lambda instances
	await chromium.font(
		"https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
	);

	const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
	const chromePath = isLocal ? process.env.CHROME_EXECUTABLE_PATH : process.env.CHROME_PACK_URL;
	console.log(isLocal);

	const browser = await puppeteer.launch({
		args: isLocal ? puppeteer.defaultArgs() : [...chromium.args, "hide-scrollbars"],
		defaultViewport: chromium.defaultViewport,
		executablePath:
			process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath(chromePath)),
		headless: chromium.headless,
	});

	const page = await browser.newPage();
	await page.goto(siteUrl);
	const pageTitle = await page.title();
	await browser.close();

	// assert.strictEqual(pageTitle, "Example Domain");

	return Response.json({
		// test: true,
		pageTitle,
	});
}
