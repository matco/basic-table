/*eslint-env node, mocha*/

const path = require('path');
const assert = require('assert');
const puppeteer = require('puppeteer');
const webpack = require('webpack');
const http = require('http');
const nodestatic = require('node-static');

const PUPPETEER_OPTIONS = {
	headless: false,
	defaultViewport: null,
	args: [
		'--no-sandbox',
	]
};

describe('BasicTable', function() {
	let server, browser, page;

	//launch server
	before(function(done) {
		this.timeout(10000);
		const config = require(path.resolve(__dirname, '..', 'webpack.config.js'));
		const compiler = webpack(config);
		compiler.run(function() {
			const file = new nodestatic.Server(path.resolve(__dirname, '..', 'example', 'dist'));
			server = http.createServer(function(request, response) {
				request.addListener('end', function () {
					file.serve(request, response);
				}).resume();
			}).listen(9000);
			done();
		});
	});

	//launch browser
	before(async function() {
		this.timeout(10000);
		browser = await puppeteer.launch(PUPPETEER_OPTIONS);
		page = await browser.newPage();
		await page.goto('http://localhost:9000/index.html');
	});

	after(async function() {
		await page.close();
		await browser.close();
		server.close();
	});

	it('loads table properly', async function() {
		assert.strictEqual(await page.$eval('#table1 > table > thead > tr > th', e => e.textContent), 'Country');
		assert.strictEqual(await page.$eval('#table1 > table > thead > tr > th:nth-child(2)', e => e.textContent), 'Name');
	});

	it('sorts data properly', async function() {
		assert.strictEqual(await page.$eval('#table1 > table > tbody > tr > td', e => e.textContent), 'Afghanistan');
		assert.strictEqual(await page.$eval('#table1 > table > tbody > tr:nth-child(2) > td', e => e.textContent), 'Åland Islands');
		await page.click('#table1 > table > thead > tr > th');
		assert.strictEqual(await page.$eval('#table1 > table > tbody > tr > td', e => e.textContent), 'Virgin Islands, British');
		assert.strictEqual(await page.$eval('#table1 > table > tbody > tr:nth-child(2) > td', e => e.textContent), 'Viet Nam');
	});

	it('searches properly', async function() {
		this.timeout(10000);
		assert.strictEqual(await page.$eval('#table1 div.table_footer_info > span', e => e.textContent), 'Display items 1 - 10 of 98');
		assert.strictEqual(await page.$eval('#table1 > table > tbody', e => e.children.length), 10);

		//do a search
		await page.type('#table1 input[type="search"]', 'Au');
		await page.waitForTimeout(200);
		assert.strictEqual(await page.$eval('#table1 div.table_footer_info > span', e => e.textContent), 'Display items 1 - 8 of 8');
		assert.strictEqual(await page.$eval('#table1 > table > tbody', e => e.children.length), 8);

		//clear search
		await page.$eval('#table1 input[type="search"]', e => e.value = '');
		await page.waitForTimeout(200);
		assert.strictEqual(await page.$eval('#table1 div.table_footer_info > span', e => e.textContent), 'Display items 1 - 10 of 98');
		assert.strictEqual(await page.$eval('#table1 > table > tbody', e => e.children.length), 10);
	});

	it('handles advanced search properly', async function() {
		this.timeout(10000);
		assert.strictEqual(await page.$eval('#table2 div.table_footer_info > span', e => e.textContent), 'Display items 1 - 3 of 3');
		assert.strictEqual(await page.$eval('#table2 > table > tbody', e => e.children.length), 3);

		//do an advanced search
		await page.evaluate('table2.filterFunction(record => record.rights.hasOwnProperty("JEDI"))');
		assert.strictEqual(await page.$eval('#table2 div.table_footer_info > span', e => e.textContent), 'Display items 1 - 1 of 1');
		assert.strictEqual(await page.$eval('#table2 > table > tbody', e => e.children.length), 1);

		//clear search
		await page.evaluate('table2.unfilter()');
		assert.strictEqual(await page.$eval('#table2 div.table_footer_info > span', e => e.textContent), 'Display items 1 - 3 of 3');
		assert.strictEqual(await page.$eval('#table2 > table > tbody', e => e.children.length), 3);
	});
});
