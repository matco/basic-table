# basic-table
basic-table displays your tabular data in a nice HTML table.

## Usage
Install as an NPM dependency:
```
npm i basic-table --save
```

The instructions belows are for those who are using Webpack:

In your CSS:
```
@import url(~basic-table/src/table.css);
```

In your code:
```
import {Table} from 'basic-table/src/table.js';
import {Datasource} from 'basic-table/src/datasource.js';
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
	actions : [
		{label : 'Export', url : '#export'}
	]
}).render(new Datasource({url : 'data.json'}));
```

## Example
If you want to see some examples, checkout **example/index.js**.

## Development
If you wan to develop and use the example page to see the result, run:
```
npm start
```

This will launch a webpack server on port 9000.