import {Table, Datasource} from '../src/index.js';

function parse_date(date) {
	const parts = date.match(/^(\d{1,2}).(\d{1,2}).(\d{4})$/);
	//return data only if format is valid
	if(parts) {
		return new Date(parts[3] + '/' + parts[2] + '/' + parts[1]);
	}
	//to be consistent with native date API, return an invalid date
	return new Date('Invalid date');
}

function format_date(date) {
	return date.getDate().toString().padStart(2, '0') + '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear();
}

window.addEventListener(
	'load',
	function() {
		(function() {
			document.getElementById('table1_search').addEventListener(
				'submit',
				async function(event) {
					event.preventDefault();
					const start = this['start'].value ? parse_date(this['start'].value) : undefined;
					const stop = this['stop'].value ? parse_date(this['stop'].value) : undefined;
					const response = await fetch('data1.json');
					const result = await response.json();
					const data = result.filter(function(row) {
						const row_date = new Date(row.date);
						if(start && start.getTime() > row_date.getTime()) {
							return false;
						}
						if(stop && stop.getTime() < row_date.getTime()) {
							return false;
						}
						return true;
					});
					table.render(new Datasource({data: data}));
					let export_url = '#export';
					if(start) {
						export_url += ('|start=' + format_date(start));
					}
					if(stop) {
						export_url += ('|stop=' + format_date(stop));
					}
					table.setActions([{label: 'Export', url: export_url}]);
				}
			);

			function render_name(value, record) {
				const link = document.createElement('a');
				link.setAttribute('href', '#id=' + record.id);
				link.appendChild(document.createTextNode(value));
				return link;
			}

			function render_date(value) {
				return format_date(value);
			}

			function render_value(value) {
				const number = document.createElement('span');
				number.style.display = 'inline-block';
				number.style.width = '100%';
				number.style.textAlign = 'right';
				number.style.color = value < 0 ? 'red' : 'green';
				number.appendChild(document.createTextNode(value));
				return number;
			}

			const columns = [
				{label: 'Country', data: 'country', type: Table.DataType.STRING, width: 250},
				{label: 'Name', data: 'name', type: Table.DataType.STRING, render: render_name, width: 200},
				{label: 'Date', data: 'date', type: Table.DataType.DATE, render: render_date, width: 120},
				{label: 'IBAN', data: 'iban', type: Table.DataType.STRING},
				{label: 'Value', data: 'value', type: Table.DataType.NUMBER, render: render_value, width: 120}
			];

			const table = new Table({
				container: document.getElementById('table1'),
				columns: columns,
				actions: [
					{label: 'Export', url: '#export'}
				]
			});
			table.render(new Datasource({url: 'data1.json'}));

			//make this table global so it can be tested
			window['table1'] = table;
		})();

		(function() {
			function render_right(profileId, value, record) {
				const input = document.createElement('input');
				input.setAttribute('type', 'checkbox');
				if(record.rights[profileId]) {
					input.setAttribute('checked', 'checked');
				}
				input.addEventListener('click', function() {
					console.log('Profile ' + profileId + ' ' + (this.checked ? 'added' : 'removed') + ' for user ' + record.login);
				});
				return input;
			}

			function render_user(value, record) {
				const link = document.createElement('a');
				link.setAttribute('href', '#user=' + record.login);
				link.appendChild(document.createTextNode(record.firstname + ' ' + record.lastname));
				return link;
			}

			const user_label = document.createElement('span');
			user_label.style.color = 'blue';
			user_label.textContent = 'User';

			const columns = [
				{label: user_label, data: 'login', type: Table.DataType.STRING, unsortable: true, render: render_user},
				{label: 'Jedi', type: Table.DataType.STRING, width: 100, unsortable: true, render: render_right.bind(undefined, 'JEDI')},
				{label: 'Sith', type: Table.DataType.STRING, width: 100, unsortable: true, render: render_right.bind(undefined, 'SITH')},
				{label: 'Rebel', type: Table.DataType.STRING, width: 100, unsortable: true, render: render_right.bind(undefined, 'REBEL')}
			];

			const table = new Table({
				container: document.getElementById('table2'),
				columns: columns,
				enableSearch: false
			});
			table.render(new Datasource({url: 'data2.json'}));

			//make this table global so it can be tested
			window['table2'] = table;
		})();

		(function() {
			const data = [
				{'key': '3e48f042-9a4d-4271-993f-f48809722591','host': '0:0:0:0:0:0:0:1','agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:22.0) Gecko/20100101 Firefox/25.0','date': '2013-06-07T16:30:45.120+0000','last_use': '2013-06-07T16:30:45.120+0000', 'entries': 5},
				{'key': 'd9b8361b-2fc1-444f-ab9e-8748ffed335e','host': '0:0:0:0:0:0:0:1','agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:22.0) Gecko/20100101 Firefox/22.0','date': '2013-06-08T16:31:54.890+0000','last_use': '2013-06-07T16:31:54.890+0000', 'entries': 1},
				{'key': '2397d6c1-4a75-4589-b551-cebb3c33477d','host': '0:0:0:0:0:0:0:1','agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:22.0) Gecko/20100101 Firefox/22.0','date': '2013-06-10T07:50:14.965+0000','last_use': '2013-06-10T07:50:14.965+0000', 'entries': 12},
				{'key': '740185cc-7ace-4b07-a476-6245ee75d509','host': '0:0:0:0:0:0:0:1','agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36','date': '2013-06-10T07:55:01.075+0000','last_use': '2013-06-10T07:55:01.075+0000', 'entries': 0},
				{'key': '343d0239-6bf7-4ae5-ba37-5ebb715629c1','host': '0:0:0:0:0:0:0:1','agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:24.0) Gecko/20100101 Firefox/24.0','date': '2013-06-10T07:58:49.304+0000','last_use': '2013-06-10T07:58:49.304+0000', 'entries': 8},
				{'key': '8500593d-5eba-4ade-9816-f866f47edfa9','host': '0:0:0:0:0:0:0:1','agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:22.0) Gecko/20100101 Firefox/25.0','date': '2013-06-09T07:59:05.510+0000','last_use': '2013-06-10T08:55:07.869+0000', 'entries': 1},
				{'key': 'fee4040f-4857-48e0-930a-0e51b0a97c59','host': '0:0:0:0:0:0:0:1','agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:22.0) Gecko/20100101 Firefox/22.0','date': '2013-06-10T08:22:06.305+0000','last_use': '2013-06-10T08:55:07.869+0000', 'entries': 2},
				{'key': 'a962e520-58f5-11e4-8ed6-0800200c9a66','host': '0:0:0:0:0:0:0:1','agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)','date': '2013-06-10T08:22:06.305+0000','last_use': '2013-06-10T08:55:07.869+0000', 'entries': 7}
			];

			function render_date(value) {
				return value !== null ? format_date(value) : 'NA';
			}

			function render_delete(value, record) {
				const button = document.createElement('button');
				button.textContent = 'Delete';
				button.addEventListener(
					'click',
					function() {
						const index = data.indexOf(record);
						data.splice(index, 1);
						table.render(new Datasource({data: data}));
						console.log('Authorization ' + record.key + ' deleted');
					}
				);
				return button;
			}

			const columns = [
				{label: 'Date', data: 'date', type: Table.DataType.DATE, render: render_date, width: 110},
				{label: 'Host', data: 'host', type: Table.DataType.STRING, width: 120},
				{label: 'Agent', data: 'agent', type: Table.DataType.STRING},
				{label: 'Last use', data: 'last_use', type: Table.DataType.DATE, render: render_date, width: 100},
				{label: 'Entries', data: 'entries', type: Table.DataType.NUMBER, width: 100},
				{label: 'Delete', data: 'key', render: render_delete, type: Table.DataType.STRING, width: 60}
			];

			const table = new Table({
				container: document.getElementById('table3'),
				columns: columns,
				enableSearch: false,
				statusText: 'Display clients ${start} - ${stop} of ${total}'
			});
			table.render(new Datasource({data: data}));

			//make this table global so it can be tested
			window['table3'] = table;
		})();
	}
);
