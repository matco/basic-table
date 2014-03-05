'use strict';

assert.begin();

//let grid load
wait(function() {
	//clear session storage
	sessionStorage.removeItem('grid1');

	assert.equal(get('#grid1 > table > thead > tr > th').textContent, 'Center', 'Column 1 of header is "Center"');
	assert.equal(get('#grid1 > table > thead > tr > th:nth-child(2)').textContent, 'Patient', 'Column 2 header is "Patient"');

	//check sort
	var center_sort_image = get('#grid1 > table > thead > tr > th > img');
	function sort_on_first_column_ascending() {
		if(!center_sort_image.style.display === 'none' || center_sort_image.getAttribute('src') === 'bullet_arrow_down.png') {
			//sort according to first column, ascending
			click('#grid1 > table > thead > tr > th');
		}
	}
	//one time to sort on good column and an other time may be required to sort ascending
	sort_on_first_column_ascending();
	sort_on_first_column_ascending();

	assert.equal(get('#grid1 > table > tbody > tr > td').textContent, 'AR-007', 'First column of first line contains "AR-007"');
	click('#grid1 > table > thead > tr > th');
	assert.equal(get('#grid1 > table > tbody > tr > td').textContent, 'NO-006', 'First column of first line contains "NO-006"');

	//check search
	assert.equal(get('#grid1 div.grid_footer_info > span').textContent, 'Display items 1 - 10 of 65', 'Grid records info displays "Display items 1 - 10 of 65"');
	assert.equal(get('#grid1 > table > tbody').children.length, 10, 'Grid contains 10 lines');
	type('#grid1 input[type="search"]', 'AU');
	//let time to grid to detect and do the search
	wait(function() {
		assert.equal(get('#grid1 div.grid_footer_info > span').textContent, 'Display items 1 - 4 of 4', 'Grid records info has been updated with right record number');
		assert.equal(get('#grid1 > table > tbody').children.length, 4, 'Grid contains 4 lines');
		//clear search
		type('#grid1 input[type="search"]', '');
		wait(function() {
			assert.equal(get('#grid1 div.grid_footer_info > span').textContent, 'Display items 1 - 10 of 65', 'Grid records info displays "Display items 1 - 10 of 65"');
			assert.equal(get('#grid1 > table > tbody').children.length, 10, 'Grid contains 10 lines');

			//clear session storage
			sessionStorage.removeItem('grid2');

			//check custom search
			assert.equal(get('#grid2 div.grid_footer_info > span').textContent, 'Display items 1 - 2 of 2', 'Grid records info displays "Display items 1 - 2 of 2"');
			assert.equal(get('#grid2 > table > tbody').children.length, 2, 'Grid contains 2 lines');
			grid2.filterFunction(function(record) {
				return record.rights.hasOwnProperty('PRINCIPAL_INVESTIGATOR');
			});
			assert.equal(get('#grid2 div.grid_footer_info > span').textContent, 'Display items 1 - 1 of 1', 'Grid records info displays "Display items 1 - 1 of 1"');
			assert.equal(get('#grid2 > table > tbody').children.length, 1, 'Grid contains 1 lines');

			assert.end();
		}, 500);
	}, 500);
});
