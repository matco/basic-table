function uncache(url) {
	return url + (url.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
}

function sort(data) {
	const that = this;
	data.sort(function(a, b) {
		let index = 0;
		let field;
		let result;
		while(!result && index < that.sortingOrders.length) {
			field = that.sortingOrders[index].field;
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
					result = a_data.compareTo(b_data);
				}
			}
			index++;
		}
		return that.sortingOrders[index - 1].descendant ? - result : result;
	});
}

export class Datasource {
	constructor(parameters) {
		//data
		//asynchronous mode
		this.url;
		this.lazy;

		//synchronous mode
		this.data;

		//events
		this.ready;

		//bind parameters
		for(const parameter in parameters) {
			this[parameter] = parameters[parameter];
		}

		//check required parameters
		if(!this.url && !this.data) {
			throw new Error('One of following parameters is required : url or data');
		}

		//check consistency
		if(this.lazy && !this.url) {
			throw new Error('Lazy grid requires following parameter : url');
		}

		//internal variables
		this.length;
		this.filteredData;
		this.sortingOrders = [];
	}
	init(callback) {
		const that = this;

		//retrieve amount (length) of data
		//datasources that must retrieve data
		if(this.url) {
			//datasources that can retrieve all data at once using an url
			if(!this.lazy) {
				const url = uncache(this.url);
				const xhr = new XMLHttpRequest();
				xhr.addEventListener(
					'load',
					function(event) {
						if(event.target.status === 200) {
							that.data = event.target.response;
							that.length = that.data.length;
							if(callback) {
								callback.call();
							}
						}
						else {
							throw new Error('Unable to retrieve data : ' + xhr.status + ' ' + xhr.statusText);
						}
					}
				);
				xhr.open('GET', url, true);
				xhr.responseType = 'json';
				xhr.send();
			}
			//datasources that are lazy, length must be retrieved explicitly
			else {
				const xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if(xhr.readyState === 4) {
						if(xhr.status === 200) {
							that.length = JSON.parse(xhr.responseText).length;
							if(callback) {
								callback.call();
							}
						}
						else {
							throw new Error('Unable to retrieve data length : ' + xhr.status + ' ' + xhr.statusText);
						}
					}
				};
				xhr.open('GET', uncache(that.url) + '&length=true', true);
				xhr.send();
			}
		}
		else {
			//datasources that already have data
			this.length = this.data.length;
			if(callback) {
				callback.call();
			}
		}
	}
	getLength() {
		return this.filteredData ? this.filteredData.length : this.length;
	}
	getData(start, limit, callback) {
		//filtered data
		if(this.filteredData) {
			sort.call(this, this.filteredData);
			callback.call(undefined, this.filteredData.slice(start, limit ? start + limit : undefined));
		}
		else {
			//non lazy grids, data are already here
			if(this.data) {
				sort.call(this, this.data);
				callback.call(undefined, this.data.slice(start, limit ? start + limit : undefined));
			}
			//lazy grids
			else {
				let url = uncache(this.url);
				if(this.lazy) {
					url += ('&start=' + start);
					url += ('&limit=' + limit);
					if(!this.sortingOrders.isEmpty()) {
						url += ('&order=' + this.sortingOrders[0].field);
						url += ('&descendant=' + this.sortingOrders[0].descendant);
					}
				}
				const xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if(xhr.readyState === 4) {
						if(xhr.status === 200) {
							const data = JSON.parse(xhr.responseText);
							callback.call(undefined, data);
						}
						else {
							throw new Error('Unable to retrieve data : ' + xhr.status + ' ' + xhr.statusText);
						}
					}
				};
				xhr.open('GET', url, true);
				xhr.send();
			}
		}
	}
	filter(filter) {
		this.filteredData = this.data.filter(filter);
	}
	unfilter() {
		this.filteredData = undefined;
	}
}
