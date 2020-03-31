# js-grid
js-grid displays your tabular data in a nice HTML grid.

**grid.html** contains some examples showing how to use it.

## Usage
Install as an NPM dependency:
```
npm i -s git+ssh://git@github.com:matco/js-grid.git
```

In your code:
```
import {Grid} from './node_modules/js-grid/grid.js';
import {Datasource} from './node_modules/js-grid/datasource.js';
```

Then:
```
function render_name(value, record) {
	const link = document.createElement('a');
	link.setAttribute('href', '#id=' + record.id);
	link.appendChild(document.createTextNode(value));
	return link;
}

function render_date(value) {
	return value.toDisplay();
}

new Grid({
	container : document.getElementById('grid1'),
	columns : [
		{label : 'Country', data : 'country', type : Grid.DataType.STRING, width : 250},
		{label : 'Name', data : 'name', type : Grid.DataType.STRING, render : render_name, width : 200},
		{label : 'Date', data : 'date', type : Grid.DataType.DATE, render : render_date, width : 120},
		{label : 'IBAN', data : 'iban', type : Grid.DataType.STRING},
		{label : 'Value', data : 'value', type : Grid.DataType.NUMBER, width : 120}
	],
	path : '',
	actions : [
		{label : 'Export', url : '#export'}
	]
}).render(new Datasource({url : 'data1.json'}));
```
