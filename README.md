# basic-table
basic-table displays your tabular data in a nice HTML table.

**index.html** contains some examples showing how to use it.

## Usage
Install as an NPM dependency:
```
npm i basic-table --save
```

The instructions belows are for those who are using Webpack and have an alias to `node_modules` named `node_modules`:
```
alias: {
	'node_modules': path.join(__dirname, 'node_modules'),
}
```

In your CSS:
```
@import url(~node_modules/basic-table/table.css);
```

In your code:
```
import {Table} from 'node_modules/basic-table/table.js';
import {Datasource} from 'node_modules/basic-table/datasource.js';
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

new Table({
	container : document.getElementById('table'),
	columns : [
		{label : 'Country', data : 'country', type : Table.DataType.STRING, width : 250},
		{label : 'Name', data : 'name', type : Table.DataType.STRING, render : render_name, width : 200},
		{label : 'Date', data : 'date', type : Table.DataType.DATE, render : render_date, width : 120},
		{label : 'IBAN', data : 'iban', type : Table.DataType.STRING},
		{label : 'Value', data : 'value', type : Table.DataType.NUMBER, width : 120}
	],
	path : '',
	actions : [
		{label : 'Export', url : '#export'}
	]
}).render(new Datasource({url : 'data.json'}));
```
