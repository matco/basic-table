'use strict';

assert.begin();

//let grid load
wait(function() {
	//clear session storage
	sessionStorage.removeItem('grid1');

	assert.equal(get('#grid1 > table > thead > tr > th').textContent, 'Country', 'Column 1 of header is "Country"');
	assert.equal(get('#grid1 > table > thead > tr > th:nth-child(2)').textContent, 'Name', 'Column 2 header is "Name"');

	//check sort
	var country_sort_image = get('#grid1 > table > thead > tr > th > img');
	function sort_on_first_column_ascending() {
		if(!country_sort_image.style.display === 'none' || country_sort_image.getAttribute('src') === 'bullet_arrow_down.png') {
			//sort according to first column, ascending
			click('#grid1 > table > thead > tr > th');
		}
	}
	//one time to sort on good column and an other time may be required to sort ascending
	sort_on_first_column_ascending();
	sort_on_first_column_ascending();

	assert.equal(get('#grid1 > table > tbody > tr > td').textContent, 'Afghanistan', 'First column of first line contains "Afghanistan"');
	assert.equal(get('#grid1 > table > tbody > tr:nth-child(2) > td').textContent, 'Åland Islands', 'First column of first line contains "Åland Islands"');
	click('#grid1 > table > thead > tr > th');
	assert.equal(get('#grid1 > table > tbody > tr > td').textContent, 'Virgin Islands, British', 'First column of first line contains "Virgin Islands, British"');
	assert.equal(get('#grid1 > table > tbody > tr:nth-child(2) > td').textContent, 'Viet Nam', 'First column of first line contains "Viet Nam"');

	//check search
	assert.equal(get('#grid1 div.grid_footer_info > span').textContent, 'Display items 1 - 10 of 98', 'Grid records info displays "Display items 1 - 10 of 98"');
	assert.equal(get('#grid1 > table > tbody').children.length, 10, 'Grid contains 10 lines');
	type('#grid1 input[type="search"]', 'Au');
	//let time to grid to detect and do the search
	wait(function() {
		assert.equal(get('#grid1 div.grid_footer_info > span').textContent, 'Display items 1 - 8 of 8', 'Grid records info has been updated with right record number');
		assert.equal(get('#grid1 > table > tbody').children.length, 8, 'Grid contains 8 lines');
		//clear search
		type('#grid1 input[type="search"]', '');
		wait(function() {
			assert.equal(get('#grid1 div.grid_footer_info > span').textContent, 'Display items 1 - 10 of 98', 'Grid records info displays "Display items 1 - 10 of 98"');
			assert.equal(get('#grid1 > table > tbody').children.length, 10, 'Grid contains 10 lines');

			//clear session storage
			sessionStorage.removeItem('grid2');

			//check custom search
			assert.equal(get('#grid2 div.grid_footer_info > span').textContent, 'Display items 1 - 3 of 3', 'Grid records info displays "Display items 1 - 3 of 3"');
			assert.equal(get('#grid2 > table > tbody').children.length, 3, 'Grid contains 3 lines');
			grid2.filterFunction(function(record) {
				return record.rights.hasOwnProperty('JEDI');
			});
			assert.equal(get('#grid2 div.grid_footer_info > span').textContent, 'Display items 1 - 1 of 1', 'Grid records info displays "Display items 1 - 1 of 1"');
			assert.equal(get('#grid2 > table > tbody').children.length, 1, 'Grid contains 1 lines');

			assert.end();
		}, 500);
	}, 500);
});
