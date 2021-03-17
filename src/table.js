import {Datasource} from './datasource.js';

function is_string(object) {
	return typeof(object) === 'string';
}

function create_element(tag, attributes, text, listeners) {
	const element = document.createElement(tag);
	if(attributes) {
		for(const attribute in attributes) {
			if(attributes.hasOwnProperty(attribute)) {
				element.setAttribute(attribute, attributes[attribute]);
			}
		}
	}
	if(text !== undefined) {
		element.appendChild(document.createTextNode(text));
	}
	if(listeners) {
		for(const listener in listeners) {
			if(listeners.hasOwnProperty(listener)) {
				element.addEventListener(listener, listeners[listener], false);
			}
		}
	}
	return element;
}

function clear_element(element) {
	while(element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function resort(table) {
	table.start = 0;
	table.draw();
	const sorting_order = table.datasource.sortingOrders[0];
	//update sort image
	for(let i = 0; i < table.columns.length; i++) {
		const column = table.columns[i];
		//only columns with data are sortable
		if(column.data && !column.unsortable) {
			const header_column = table.head.firstChild.childNodes[i];
			header_column.classList.remove('sort_ascending');
			header_column.classList.remove('sort_descending');
			if(column.data === sorting_order.field) {
				header_column.classList.add(sorting_order.descendant ? 'sort_descending' : 'sort_ascending');
			}
		}
	}
}

function data_filter(table, filter) {
	table.datasource.filter(filter);
	table.start = 0;
	table.draw();
}

export class Table {
	constructor(parameters) {
		//required parameters
		this.container = undefined;
		this.columns = [];
		this.datasource;
		//optional parameters with default value
		this.id;
		this.title = undefined;
		this.actions = [];
		this.statusText = 'Display items ${start} - ${stop} of ${total}';
		this.rowPerPage = 10;
		this.rowClass = undefined;
		this.enableSearch = true;
		this.allowMissingData = false;
		//events
		this.afterRender = undefined;

		//bind parameters
		for(const parameter in parameters) {
			this[parameter] = parameters[parameter];
		}

		//internal variables
		this.start = 0;

		//try to identify table
		if(!this.id) {
			this.id = this.container.id;
		}

		//check required parameters
		if(!this.container || !this.columns) {
			throw new Error('Following parameters are required: container and columns');
		}

		//check columns
		for(let i = 0; i < this.columns.length; i++) {
			const column = this.columns[i];
			if(!column.data && !column.render || !column.label) {
				throw new Error(`Column ${i} is incomplete (must have data or render, and label)`);
			}
			if(!column.unsortable && (!column.data || !column.type)) {
				throw new Error(`Column ${column.label} must have data or type to be sortable or be set as unsortable`);
			}
		}

		const that = this;

		//header
		this.header = create_element('div', {'class': 'table_header'});
		if(this.title) {
			this.header.appendChild(create_element('h2', {}, this.title));
		}

		//table
		this.table = create_element('table', {'class': 'table_content'});

		//table header
		this.head = document.createElement('thead');
		const header_line = create_element('tr');
		this.head.appendChild(header_line);

		for(let i = 0; i < this.columns.length; i++) {
			const column = this.columns[i];
			const header_column = create_element('th', {style: 'width: ' + column.width + 'px;'});
			//create or use label
			const header_label = is_string(column.label) ? document.createTextNode(column.label) : column.label;
			header_column.appendChild(header_label);
			if(!column.unsortable) {
				header_column.style.cursor = 'pointer';
				header_column.addEventListener(
					'click',
					(function(field) {
						return function() {
							const previous_sort_order = that.datasource.sortingOrders[0];
							that.addOrdering(field, !previous_sort_order.descendant);
						};
					})(column.data)
				);
			}
			header_line.appendChild(header_column);
		}
		this.table.appendChild(this.head);

		//table body
		this.body = create_element('tbody');
		this.table.appendChild(this.body);

		//footer
		this.footer = create_element('div', {'class': 'table_footer'});

		const search_bar = create_element('div', {'class': 'table_footer_search'});
		this.footer.appendChild(search_bar);

		if(this.enableSearch) {
			const search_form = create_element('form');
			const search_label = create_element('label', {}, 'Filter');
			this.search_input = create_element('input', {type: 'search'});
			//scan search input
			let last_filter = '';
			setInterval(() => {
				if(last_filter !== this.search_input.value) {
					last_filter = this.search_input.value;
					this.filter(last_filter);
				}
			}, 100);
			search_label.appendChild(this.search_input);
			search_form.appendChild(search_label);
			search_bar.appendChild(search_form);
		}

		this.buttons = create_element('div', {'class': 'table_footer_buttons'});
		this.footer.appendChild(this.buttons);

		this.setActions(this.actions);

		if(this.rowPerPage) {
			//controls
			this.controls = create_element('div', {'class': 'table_footer_controls'});
			this.footer.appendChild(this.controls);

			//first
			this.firstButton = create_element('button', {title: 'First', alt: 'First', 'class': 'control_first'}, undefined,
				{
					'click': function() {
						if(that.start !== 0) {
							that.start = 0;
							that.draw();
						}
					}
				}
			);
			this.controls.appendChild(this.firstButton);
			//previous
			this.previousButton = create_element('button', {title: 'Previous', alt: 'Previous', 'class': 'control_previous'}, undefined,
				{
					'click': function() {
						if(that.start > 1) {
							that.start -= that.rowPerPage;
							that.draw();
						}
					}
				}
			);
			this.controls.appendChild(this.previousButton);
			//next
			this.nextButton = create_element('button', {title: 'Next', alt: 'Next', 'class': 'control_next'}, undefined,
				{
					'click': function() {
						if(that.start + that.rowPerPage < that.datasource.getLength()) {
							that.start += that.rowPerPage;
							that.draw();
						}
					}
				}
			);
			this.controls.appendChild(this.nextButton);
			//last
			this.lastButton = create_element('button', {title: 'Last', alt: 'Last', 'class': 'control_last'}, undefined,
				{
					'click': function() {
						const last_start = (Math.ceil(that.datasource.length / that.rowPerPage) - 1) * that.rowPerPage;
						if(that.start !== last_start) {
							that.start = last_start;
							that.draw();
						}
					}
				}
			);
			this.controls.appendChild(this.lastButton);

			//info
			this.info = create_element('div', {'class': 'table_footer_info'});
			this.status = create_element('span');
			this.info.appendChild(this.status);
			this.footer.appendChild(this.info);
		}
		//insertion
		clear_element(this.container);
		this.container.appendChild(this.header);
		this.container.appendChild(this.table);
		this.container.appendChild(this.footer);
		//display footer only if there is something in it
		this.footer.style.display = this.enableSearch || this.rowPerPage || this.actions.length > 0 ? 'flex' : 'none';
	}
	setActions(actions) {
		this.actions = actions;
		clear_element(this.buttons);
		for(let i = 0; i < this.actions.length; i++) {
			const action = this.actions[i];
			let action_item;
			if(is_string(action.label)) {
				action_item = create_element('a', {href: action.url, 'class': 'button'}, action.label);
			}
			else {
				action_item = action.label;
			}
			this.buttons.appendChild(action_item);
		}
		//display footer only if there is something in it
		this.footer.style.display = this.enableSearch || this.rowPerPage || this.actions.length > 0 ? 'flex' : 'none';
	}
	setOrdering(field, descendant) {
		this.datasource.sortingOrders = [{field: field, descendant: descendant}];
		resort(this);
	}
	addOrdering(field, descendant) {
		//remove any ordering if it already exists
		this.datasource.sortingOrders = this.datasource.sortingOrders.filter(o => o.field !== field);
		//add new sort order
		this.datasource.sortingOrders.unshift({field: field, descendant: descendant});
		//no need to sort on more than three columns
		if(this.datasource.sortingOrders.length > 3) {
			this.datasource.sortingOrders.pop();
		}
		resort(this);
	}
	filter(filter, filter_column, exact_matching) {
		const lower_filter = filter.toLowerCase();
		data_filter.call(undefined, this, record => {
			for(let i = 0; i < this.columns.length; i++) {
				const column = this.columns[i];
				//filter only on one column if asked
				if(!filter_column || filter_column && column.data === filter_column.data) {
					//var value = column.render ? record[i].rendered : record[i].raw;
					const value = record[column.data];
					if(typeof value === 'string') {
						if(exact_matching && value === filter || value.toLowerCase().includes(lower_filter)) {
							return true;
						}
					}
					else if(typeof value === 'object') {
						//this does not work anymore
						if(exact_matching && value.innerHTML === filter || value.innerHTML.toLowerCase().includes(lower_filter)) {
							return true;
						}
					}
				}
			}
			return false;
		});
	}
	filterFunction(filter) {
		data_filter.call(undefined, this, function(record) {
			return filter(record);
		});
	}
	unfilter() {
		this.datasource.unfilter();
		this.start = 0;
		this.draw();
	}
	render(datasource) {
		this.footer.classList.add('loading');
		//keep a handle on datasource
		this.datasource = datasource;
		//datasource is required and must be a table datasource
		if(!this.datasource || this.datasource.constructor !== Datasource) {
			throw new Error('A datasource is required to render the table');
		}
		//restore state
		const serialized_state = sessionStorage.getItem(this.id);
		if(serialized_state) {
			try {
				const state = JSON.parse(serialized_state);

				this.start = state.start;
				this.datasource.sortingOrders = state.datasource.sortingOrders;
				//remove now invalid columns from restored sorting columns
				this.datasource.sortingOrders = this.datasource.sortingOrders.filter(function(sorting_order) {
					const column = this.columns.find(c => c.data === sorting_order.field);
					return column && !column.unsortable;
				}, this);

				/*if(this.enableSearch && state.search) {
					this.search_input.value = state.search;
				}*/
			}
			catch(exception) {
				//unable to restore state
				console.error(`Unable to restore state for table ${this.id}`);
			}
		}

		//set arbitrary sorting order if needed
		if(this.datasource.sortingOrders.length === 0) {
			//find first sortable column
			const column = this.columns.find(c => !c.unsortable);
			//if there is a sortable column, add it in sorting orders
			if(column) {
				this.datasource.sortingOrders.push({field: column.data, descendant: false});
			}
		}

		//initialize datasource and render retrieved data if any
		datasource.init().then(() => {
			//check start offset
			if(this.start > this.datasource.getLength()) {
				this.start = 0;
			}

			//update column ui
			if(this.datasource.sortingOrders.length > 0) {
				const column_index = this.columns.findIndex(c => c.data === this.datasource.sortingOrders[0].field);
				const header_column = this.head.children[0].children[column_index];
				header_column.classList.remove('sort_ascending');
				header_column.classList.remove('sort_descending');
				header_column.classList.add(this.datasource.sortingOrders[0].descendant ? 'sort_descending' : 'sort_ascending');
			}

			//data may already be available
			if(datasource.data) {
				//check data
				if(!this.allowMissingData) {
					for(let i = 0; i < this.columns.length; i++) {
						const column = this.columns[i];
						if(column.data) {
							for(let j = 0; j < datasource.data.length; j++) {
								if(!datasource.data[j].hasOwnProperty(column.data)) {
									throw new Error(`Column ${i} uses data ${column.data} but this data does not exist in record ${j}`);
								}
							}
						}
					}
				}

				//do search if needed
				if(this.enableSearch && this.search_input.value) {
					this.filter(this.search_input.value);
				}
			}

			//call callback
			if(this.afterRender) {
				this.afterRender.call(this);
			}

			try {
				this.draw();
				this.footer.classList.remove('loading');
			}
			catch(exception) {
				throw new Error('Unable to draw table: ' + exception);
			}
		});
	}
	draw() {
		//save state
		try {
			const state = {
				datasource: {
					sortingOrders: this.datasource.sortingOrders
				},
				start: this.start
			};
			if(this.enableSearch) {
				state.search = this.search_input.value;
			}
			sessionStorage.setItem(this.id, JSON.stringify(state));
		}
		catch(exception) {
			//unable to save state
			//console.error('Unable to save state : ' + exception.message);
		}
		//empty table
		while(this.body.firstChild) {
			this.body.removeChild(this.body.firstChild);
		}
		//manage pagination
		if(this.rowPerPage) {
			//check range
			if(this.start < 0) {
				this.start = 0;
			}
			//manage first and previous button
			if(this.start > 1) {
				this.previousButton.removeAttribute('disabled');
				this.firstButton.removeAttribute('disabled');
			}
			else {
				this.previousButton.setAttribute('disabled', 'disabled');
				this.firstButton.setAttribute('disabled', 'disabled');
			}
			//manage next and last button
			if(this.start + this.rowPerPage < this.datasource.getLength()) {
				this.nextButton.removeAttribute('disabled');
				this.lastButton.removeAttribute('disabled');
			}
			else {
				this.nextButton.setAttribute('disabled', 'disabled');
				this.lastButton.setAttribute('disabled', 'disabled');
			}
		}
		//retrieve data to display
		const data = this.datasource.getData(this.start, this.rowPerPage);
		//no data
		if(data.length === 0) {
			const no_data = create_element('tr', {'class': 'even'});
			no_data.appendChild(create_element('td', {colspan: this.columns.length}, 'No data to display'));
			this.body.appendChild(no_data);
			//display status
			if(this.rowPerPage) {
				clear_element(this.status);
			}
		}
		else {
			//revive and render data
			const rendered_data = [];
			for(let i = 0; i < data.length; i++) {
				rendered_data[i] = [];
				const original_record = data[i];
				//store original record //TODO find an other way to store it as this prevent having a column linked to data name "record"
				rendered_data[i].record = original_record;
				for(let j = 0; j < this.columns.length; j++) {
					const column = this.columns[j];
					const record = {};
					if(column.data) {
						record.raw = original_record[column.data];
					}
					//revive date
					if(column.type === Table.DataType.DATE && record.raw) {
						record.raw = new Date(record.raw);
					}
					//render
					if(column.render) {
						try {
							record.rendered = column.render(record.raw, original_record);
						}
						catch(exception) {
							throw new Error(`Unable to use render function for column ${i} with data ${record.raw}: ${exception}`);
						}
						if(record.rendered === undefined) {
							throw new Error(`Render function for column ${i} does not produce a valid result with data ${record.raw}`);
						}
					}
					rendered_data[i][j] = record;
				}
			}
			//insert in table
			for(let i = 0; i < rendered_data.length; i++) {
				const line = document.createElement('tr');
				if(this.rowClass) {
					line.classList.add(this.rowClass.call(undefined, rendered_data[i].record));
				}
				else {
					line.classList.add(i % 2 === 0 ? 'even' : 'odd');
				}
				for(let j = 0; j < this.columns.length; j++) {
					const column = this.columns[j];
					const value = column.render ? rendered_data[i][j].rendered : rendered_data[i][j].raw;
					const element = create_element('td');
					//string are just appended
					if(typeof value === 'string') {
						//value must not be falsy
						if(value) {
							element.appendChild(document.createTextNode(value));
						}
					}
					//number are aligned to the right
					else if(typeof value === 'number') {
						element.setAttribute('style', 'text-align: right;');
						element.appendChild(document.createTextNode(value + ''));
					}
					//boolean are converted to string
					else if(typeof value === 'boolean') {
						element.appendChild(document.createTextNode(value + ''));
					}
					//render function may have returned a HTML element
					else {
						//value must not be falsy
						if(value) {
							element.appendChild(value);
						}
					}
					line.appendChild(element);
				}
				this.body.appendChild(line);
			}
			//display status
			if(this.rowPerPage) {
				clear_element(this.status);
				//calculate max index
				const max = this.rowPerPage ? this.start + this.rowPerPage >= this.datasource.getLength() ? this.datasource.getLength() : this.start + this.rowPerPage : this.datasource.getLength();
				//correct min index if needed
				const min = this.start >= this.datasource.getLength() ? this.rowPerPage ? this.datasource.getLength() - this.rowPerPage : 0 : this.start;
				const status = this.statusText.replace('${start}', (min + 1).toString()).replace('${stop}', max.toString()).replace('${total}', this.datasource.getLength());
				this.status.appendChild(document.createTextNode(status));
			}
		}
	}
}

Table.DataType = {
	STRING: 'String',
	DATE: 'Date',
	NUMBER: 'Number'
};
