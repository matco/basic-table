/*eslint-env node, mocha*/

import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';
import {fileURLToPath} from 'url';
import {Server} from 'node-static';
import puppeteer from 'puppeteer';
import webpack_config from '../webpack.config.js';
import webpack from 'webpack';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//retrieve potential args
const no_headless = process.argv.includes('--no-headless');

const PUPPETEER_OPTIONS = {
	headless: no_headless ? false : 'new',
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
		const compiler = webpack.webpack(webpack_config);
		compiler.run(function() {
			const file = new Server(path.resolve(__dirname, '..', 'example', 'dist'));
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

	function $shadow(selector, shadow_selector) {
		return page.evaluateHandle(
			(selector, shadow_selector) => document.querySelector(selector).shadowRoot.querySelector(shadow_selector),
			selector,
			shadow_selector
		);
	}

	async function $evalShadow(selector, shadow_selector, evaluation) {
		const element = await $shadow(selector, shadow_selector);
		return element.evaluate(evaluation);
	}

	it('loads table properly', async function() {
		assert.strictEqual(await $evalShadow('#table1', 'table > thead > tr > th', e => e.textContent), 'Country');
		assert.strictEqual(await $evalShadow('#table1', 'table > thead > tr > th:nth-child(2)', e => e.textContent), 'Name');
	});

	it('sorts data properly', async function() {
		assert.strictEqual(await $evalShadow('#table1', 'table > tbody > tr > td', e => e.textContent), 'Afghanistan');
		assert.strictEqual(await $evalShadow('#table1', 'table > tbody > tr:nth-child(2) > td', e => e.textContent), 'Åland Islands');

		//sort by name descending
		const name_title = await $shadow('#table1', 'table > thead > tr > th');
		await name_title.click();
		assert.strictEqual(await $evalShadow('#table1', 'table > tbody > tr > td', e => e.textContent), 'Virgin Islands, British');
		assert.strictEqual(await $evalShadow('#table1', 'table > tbody > tr:nth-child(2) > td', e => e.textContent), 'Viet Nam');
	});

	it('searches properly', async function() {
		this.timeout(10000);
		assert.strictEqual(await $evalShadow('#table1', 'div.status', e => e.textContent), 'Display items 1 - 10 of 98');
		assert.strictEqual(await $evalShadow('#table1', 'table > tbody', e => e.children.length), 10);

		//do a search
		const search = await $shadow('#table1', 'input[type="search"]');
		await search.type('Au');
		await new Promise(r => setTimeout(r, 200));
		assert.strictEqual(await $evalShadow('#table1', 'div.status', e => e.textContent), 'Display items 1 - 8 of 8');
		assert.strictEqual(await $evalShadow('#table1', 'table > tbody', e => e.children.length), 8);

		//clear search
		$evalShadow('#table1', 'input[type="search"]', e => e.value = '');
		await new Promise(r => setTimeout(r, 200));
		assert.strictEqual(await $evalShadow('#table1', 'div.status', e => e.textContent), 'Display items 1 - 10 of 98');
		assert.strictEqual(await $evalShadow('#table1', 'table > tbody', e => e.children.length), 10);
	});

	it('handles advanced search properly', async function() {
		this.timeout(10000);
		assert.strictEqual(await $evalShadow('#table2', 'div.status', e => e.textContent), 'Display items 1 - 3 of 3');
		assert.strictEqual(await $evalShadow('#table2', 'table > tbody', e => e.children.length), 3);

		//do an advanced search
		await page.evaluate('table2.filterFunction(record => record.rights.hasOwnProperty("JEDI"))');
		assert.strictEqual(await $evalShadow('#table2', 'div.status', e => e.textContent), 'Display items 1 - 1 of 1');
		assert.strictEqual(await $evalShadow('#table2', 'table > tbody', e => e.children.length), 1);

		//clear search
		await page.evaluate('table2.unfilter()');
		assert.strictEqual(await $evalShadow('#table2', 'div.status', e => e.textContent), 'Display items 1 - 3 of 3');
		assert.strictEqual(await $evalShadow('#table2', 'table > tbody', e => e.children.length), 3);
	});
});
