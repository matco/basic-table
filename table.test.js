/*global assert, get, click, type, wait */


assert.begin();

//let table load
wait(function() {
	//clear session storage
	sessionStorage.removeItem('table1');

	assert.equal(get('#table1 > table > thead > tr > th').textContent, 'Country', 'Column 1 of header is "Country"');
	assert.equal(get('#table1 > table > thead > tr > th:nth-child(2)').textContent, 'Name', 'Column 2 header is "Name"');

	//check sort
	const country_sort_image = get('#table1 > table > thead > tr > th > img');
	function sort_on_first_column_ascending() {
		if(!country_sort_image.style.display === 'none' || country_sort_image.getAttribute('src') === 'bullet_arrow_down.png') {
			//sort according to first column, ascending
			click('#table1 > table > thead > tr > th');
		}
	}
	//one time to sort on good column and an other time may be required to sort ascending
	sort_on_first_column_ascending();
	sort_on_first_column_ascending();

	assert.equal(get('#table1 > table > tbody > tr > td').textContent, 'Afghanistan', 'First column of first line contains "Afghanistan"');
	assert.equal(get('#table1 > table > tbody > tr:nth-child(2) > td').textContent, 'Åland Islands', 'First column of first line contains "Åland Islands"');
	click('#table1 > table > thead > tr > th');
	assert.equal(get('#table1 > table > tbody > tr > td').textContent, 'Virgin Islands, British', 'First column of first line contains "Virgin Islands, British"');
	assert.equal(get('#table1 > table > tbody > tr:nth-child(2) > td').textContent, 'Viet Nam', 'First column of first line contains "Viet Nam"');

	//check search
	assert.equal(get('#table1 div.table_footer_info > span').textContent, 'Display items 1 - 10 of 98', 'table records info displays "Display items 1 - 10 of 98"');
	assert.equal(get('#table1 > table > tbody').children.length, 10, 'table contains 10 lines');
	type('#table1 input[type="search"]', 'Au');
	//let time to table to detect and do the search
	wait(function() {
		assert.equal(get('#table1 div.table_footer_info > span').textContent, 'Display items 1 - 8 of 8', 'table records info has been updated with right record number');
		assert.equal(get('#table1 > table > tbody').children.length, 8, 'table contains 8 lines');
		//clear search
		type('#table1 input[type="search"]', '');
		wait(function() {
			assert.equal(get('#table1 div.table_footer_info > span').textContent, 'Display items 1 - 10 of 98', 'table records info displays "Display items 1 - 10 of 98"');
			assert.equal(get('#table1 > table > tbody').children.length, 10, 'table contains 10 lines');

			//clear session storage
			sessionStorage.removeItem('table2');

			//check custom search
			assert.equal(get('#table2 div.table_footer_info > span').textContent, 'Display items 1 - 3 of 3', 'table records info displays "Display items 1 - 3 of 3"');
			assert.equal(get('#table2 > table > tbody').children.length, 3, 'table contains 3 lines');
			/*table2.filterFunction(function(record) {
				return record.rights.hasOwnProperty('JEDI');
			});*/
			assert.equal(get('#table2 div.table_footer_info > span').textContent, 'Display items 1 - 1 of 1', 'table records info displays "Display items 1 - 1 of 1"');
			assert.equal(get('#table2 > table > tbody').children.length, 1, 'table contains 1 lines');

			assert.end();
		}, 500);
	}, 500);
});
