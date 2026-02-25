function is_string(object) {
	return typeof (object) === 'string';
}

function is_number(object) {
	return !isNaN(parseFloat(object)) && isFinite(object);
}

function is_date(object) {
	return Object.prototype.toString.call(object) === '[object Date]';
}

function is_boolean(object) {
	return typeof object === 'boolean';
}

function compare(object_1, object_2) {
	if(is_string(object_1) && is_string(object_2)) {
		return object_1.localeCompare(object_2);
	}
	if(is_number(object_1) && is_number(object_2)) {
		return object_1 - object_2;
	}
	if(is_date(object_1) && is_date(object_2)) {
		return object_1.getTime() - object_2.getTime();
	}
	if(is_boolean(object_1) && is_date(object_2)) {
		if(object_1 === object_2) {
			return 0;
		}
		return object_1 ? -1 : 1;
	}
	return 0;
}

export class Datasource {
	constructor(parameters) {
		//asynchronous mode
		this.url = undefined;
		//synchronous mode
		this.data = [];

		//events
		this.ready = false;

		//bind parameters
		for(const parameter in parameters) {
			this[parameter] = parameters[parameter];
		}

		//check required parameters
		if(!this.url && !this.data) {
			throw new Error('One of following parameters is required : url or data');
		}

		//internal variables
		this.length;
		this.filteredData;
		this.sortingOrders = [];
	}

	init() {
		return new Promise((resolve, reject) => {
			//URL datasources
			if(this.url) {
				fetch(this.url).then(response => {
					if(response.status === 200) {
						response.json().then(data => {
							this.data = data;
							this.length = this.data.length;
							resolve();
						});
					}
					else {
						reject(`Unable to retrieve data: ${response.status} ' ' ${response.statusText}`);
					}
				});
			}
			//preloaded datasource
			else {
				this.length = this.data.length;
				resolve();
			}
		});
	}

	getLength() {
		return this.filteredData ? this.filteredData.length : this.length;
	}

	sort(data) {
		if(this.sortingOrders.length > 0) {
			data.sort((a, b) => {
				let index = 0;
				let field;
				let result;
				while(!result && index < this.sortingOrders.length) {
					field = this.sortingOrders[index].field;
					const a_data = a[field];
					const b_data = b[field];
					if(!a_data && !b_data) {
						result = 0;
					}
					else {
						if(!a_data) {
							result = -1;
						}
						else if(!b_data) {
							result = 1;
						}
						else {
							result = compare(a_data, b_data);
						}
					}
					index++;
				}
				return this.sortingOrders[index - 1].descendant ? -result : result;
			});
		}
	}

	getData(start, limit) {
		//filtered data
		if(this.filteredData) {
			this.sort(this.filteredData);
			return this.filteredData.slice(start, limit ? start + limit : undefined);
		}
		else {
			this.sort(this.data);
			return this.data.slice(start, limit ? start + limit : undefined);
		}
	}

	filter(filter) {
		this.filteredData = this.data.filter(filter);
	}

	unfilter() {
		this.filteredData = undefined;
	}
}
