# basic-table
basic-table displays your tabular data in a nice HTML table.

## Setup
### Manual
Copy the `src` folder as `basic-table` somewhere in your project.

Import the CSS:
```
@import url(basic-table/table.css);
```

In your Javascript code:
```
import {Table, Datasource} from 'basic-table/index.js';
```

### With NPM and Webpack
The instructions below are for those who are using NPM and Webpack.

Install as an NPM dependency of your project:
```
npm i @matco/basic-table --save
```

In your CSS:
```
@import url(~@matco/basic-table/src/table.css);
```
Pay attention to the `src` folder in the path. And make sure you configured Webpack to handle CSS files.

In your code:
```
import {Table, Datasource} from '@matco/basic-table';
```

## Usage
```
function render_name(value, record) {
	const link = document.createElement('a');
	link.setAttribute('href', `#id=${record.id}`);
	link.appendChild(document.createTextNode(value));
	return link;
}

function render_date(value) {
	return value.toDisplay();
}

new Table({
	container: document.getElementById('table'),
	columns: [
		{label: 'Country', data: 'country', type: Table.DataType.STRING, width: 250},
		{label: 'Name', data: 'name', type: Table.DataType.STRING, render: render_name, width: 200},
		{label: 'Date', data: 'date', type: Table.DataType.DATE, render: render_date, width: 120},
		{label: 'IBAN', data: 'iban', type: Table.DataType.STRING},
		{label: 'Value', data: 'value', type: Table.DataType.NUMBER, width: 120}
	],
	actions: [
		{label: 'Export', url: '#export'}
	]
}).render(new Datasource({url: 'data.json'}));
```

## Example
If you want to see some examples, checkout `example/index.js`.

## Development
The instructions below are for developers.

### Example page
To manually test the project using the example page, run:
```
npm start
```
This will launch a Webpack development server on port 9000.

### Lint & Check
You can lint and check the code of the project with the following commands:
```
npm run lint
npm run tsc
```

### Test
To test the application, run:
```
npm test
```
