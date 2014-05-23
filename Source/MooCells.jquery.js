/*
---
description: MooCells class

authors:
- Andrea Dessi <nkjoep@gmail.com>

license:
- MIT-style license


requires:
 jquery: '1.10'

provides: MooCells

version: 0.26
...
*/

;(function() {
	var $ = jQuery;
	MooCells = function(options) {
		var mother = this;
		mother.options = $.extend(true, {
			format: {
				decimals: 10 //when the cell is a number, use this precision
			}
		}, options)

		/*
			cells: {
				cellKEY: {
					"el": ,
					"status": ,
					"format": ,
					"decimals": ,
					"value": function(cells) { return value },
					"dependsOn": [],
					"onUpdate": function(value) {}
				},
			},
			on(computing): function(status) {},
			on(cellChange): function(cellname, cellvalue, cellset) {},
			decimals:
		*/

		mother.cells = {};
		mother.cellsEls = {};
		mother.cellsGetter = {};
		mother.cellsLinked={};
		mother.cellsFormat={};
		mother.cellsUpdateFn={};
		mother.cellsPrecisionDecimals = {};

		this.getKeys = Object.keys || function(obj) {
			var arr = [];
			$.each(obj, function(k, v) {
				arr.push(k);
			})
			return arr;
		};

		this.	getformattedCellValue = function(name, value) {
			var currentValue;
			if (value!==undefined) {
				currentValue = value;
			}
			else {
				currentValue = this._getCellValue(name);
			}
			switch(this.cellsFormat[name]) {
				case "string":
					//currentValue = currentValue;
					var type = this.cellsEls[name].attr("type");
					if (type == "checkbox" || type == "radio" ) {
						var checked = this.cellsEls[name].prop("checked");
						if (!checked) {
							currentValue = "";
						}
					}
					break;
				case "boolean":
					currentValue = $.trim(currentValue);
					currentValue = currentValue=='true'? true : false;
					var type = this.cellsEls[name].attr("type");
					if (type == "checkbox" || type == "radio" ) {
						currentValue = this.cellsEls[name].prop("checked");
					}
					break;
				default:
					//number
					currentValue = $.trim(currentValue);
					currentValue = currentValue.replace(/,/g,'.');
					if (currentValue.split(".").length > 2) {
						currentValue = currentValue.replace(/[^\.\d\-]/g,"").replace(/\.(?!..$)/g,"").replace(/[^\d\.(?!..)-]/g,"").replace(/\.$/g,'').replace(/^-/g,"»").replace(/-/g,"").replace(/»/g,"-");
					}
					else {
						currentValue = currentValue.replace(/[^\.\d-]/g,"").replace(/^-/g,"»").replace(/-/g,"").replace(/»/g,"-");
					}
					currentValue = new Number(currentValue);
					if (currentValue==NaN) {
						currentValue = 0;
					}
			}
			return currentValue;
		};

		this._setCellValue = function(name, value) {
			var tag = mother.cellsEls[name].prop("tagName").toLowerCase();
			if (mother.cellsFormat[name] == 'number') {
				value = new Number(value).toFixed(mother.cellsPrecisionDecimals[name]).toString();
			}
			if (tag == 'select' || tag == 'textarea') {
				this.cellsEls[name].val(value);
			}
			else if(tag == 'input') {
				var type = this.cellsEls[name].attr("type");
				if (type=='text') {
					this.cellsEls[name].val(value);
				}
				else if(type=='chebox' || type=='radio') {
				}
			}
			else {
				this.cellsEls[name].text(value);
			}
		};

		this.updateCellValue = function(name, value) {
			var currentValue = mother.getformattedCellValue(name,value);
			mother.cells[name] = currentValue;
			mother._setCellValue(name, currentValue);
			mother.cellsUpdateFn[name](mother.cells[name]);
			$(window).trigger("MooCell/changed", [name, mother.cells[name], mother.cells]);
			$.each(mother.cellsLinked[name], function(index, item) {
				var value = mother.getResultCellValue(item);
				mother._setCellValue(item, value);
				mother.cellsEls[item].trigger("change");
			});
		};

		this._getCellValue =  function(name) {
			var tag = mother.cellsEls[name].prop("tagName").toLowerCase();
			var value = "";
			if(tag == 'select' || tag == 'textarea') {
				value = mother.cellsEls[name].val();
			}
			else if (tag == 'input') {
				var type = mother.cellsEls[name].attr("type");
				if (type == 'checkbox' || type == 'radio') {
					if (mother.cellsEls[name].prop("checked")) {
						value = mother.cellsEls[name].val();
					}
					else {
						value = "";
					}
				}
				else {
					value = mother.cellsEls[name].val()
				}
			}
			else {
				value = mother.cellsEls[name].text();
			}
			return value;
		};

		this.addCell = function(name, propertiesObj) {
			mother.cellsEls[name] = $(propertiesObj.el);

			if (mother.cellsEls[name].length > 1) { //array
				var bridgeElement = $('<input type="text" value=" " style="display: none; visibility: hidden;" />');
				$.each(mother.cellsEls[name], function(index, item) {
					item.on("change", {bridgeElement: bridgeElement}, function(ev){
						ev.data.bridgeElement.val($(this).val());
						ev.data.bridgeElement.trigger("change");
					});
				});
				mother.cellsEls[name] = bridgeElement;
			}
			mother.cells[name] = mother._getCellValue(name);
			mother.cellsGetter[name] = $.type(propertiesObj.value) == 'function' ? propertiesObj.value : function() {};
			mother.cellsLinked[name] = [];
			if (propertiesObj.status!==undefined) {
				if (propertiesObj.status == "readonly") {
					mother.cellsEls[name].attr("readonly","readonly");
				}
				else if (propertiesObj.status == "disabled") {
					mother.cellsEls[name].attr("disabled","disabled");
				}
			}
			mother.cellsFormat[name] = propertiesObj.format===undefined ? "number" : propertiesObj.format;
			if (mother.cellsFormat[name]=='boolean'){
				if (mother.cellsEls[name].attr("type") == 'checkbox') {
					mother.cells[name] = mother.cellsEls[name].is(":checked")
				}
			}
			else if (mother.cellsFormat[name] == 'number') {
				mother.cellsPrecisionDecimals[name] = mother.options.format.decimals;
				if (propertiesObj.decimals!==undefined) {
					mother.cellsPrecisionDecimals[name] = propertiesObj.decimals;
				}
			}
			mother.cellsEls[name].on("change", {name: name},  function(ev) {
				var value = mother._getCellValue(ev.data.name);
				mother.updateCellValue(ev.data.name, value);
			});

			/** just for IEs */
			if (mother.cellsEls[name].prop("tagName").toLowerCase() == 'input'){
				if (mother.cellsEls[name].attr("type") == 'radio') {
					mother.cellsEls[name].on("click", {name: name},  function(ev) {
						mother.cellsEls[ev.data.name].attr("checked", 'checked');
						mother.cellsEls[ev.data.name].prop("checked", true);
						mother.cellsEls[ev.data.name].trigger("change");
					});
				}
			}
			/** just for IEs /end */
			mother.cellsUpdateFn[name] = $.type(propertiesObj.onUpdate) == 'function' ? propertiesObj.onUpdate : function() {};
		};

		$.each(mother.options.cells, function(name, propertiesObj) {
			mother.addCell(name, propertiesObj);
		});

		$.each(mother.options.cells, function(name, propertiesObj) {
			$.each(propertiesObj.dependsOn||[], function(index, dependantName) {
				var noLoop = true;
				if (mother.cellsLinked[name]!=undefined) {
					if (mother.cellsLinked[name].indexOf(dependantName)>-1) {
						noLoop = false;
					}
				}
				if (noLoop) {
					if (mother.cellsLinked[dependantName]===undefined) {
						mother.cellsLinked[dependantName] = [];
					}
					mother.cellsLinked[dependantName].push(name);
				}
				else {
					if (console!==undefined && console.log!==undefined) {
						console.log("[MooCells] Warning: cross reference -> ",dependantName, mother.cellsEls[dependantName], name, mother.cellsEls[name]);
					}
				}
			});
		});

		this.getScope = function(cells) {
			$(window).trigger("MooCell/computing", ["start"]);
			var scope = {};
			var keys;
			if(cells!==undefined){
				keys = [];
				keys.push(cells);
			}
			else {
				keys = mother.getKeys(this.cells);
			}
			$.each(keys, function(index, currentKey) {
				var executedValue = mother.cellsGetter[currentKey](mother.cells);
				if (executedValue===undefined) executedValue = null;
				scope[currentKey] = executedValue;
			});
			$(window).trigger("MooCell/computing", ["end"]);
			return scope;
		};

		this.getResultCellValue = function(cell) {
			return mother.getScope(cell)[cell];
		};
		this.updateAll = function() {
			$.each(mother.cells, function(key, value){
				mother.updateCellValue(key);
			});
		};
		return this;
	};
})();


/*



















var Class = function() {};
var Events = null;
var Options = null;
var MooCellsOld = new Class({
	Implements: [Events, Options],
	options: {
		format: {
			decimals: 10 //when the cell is a number, use this precision
		}
	},
	initialize: function(options) {
		this.setOptions(options);
		this.cells = {};
		this.cellsEls = {};
		this.cellsGetter = {};
		this.cellsLinked={};
		this.cellsFormat={};
		this.cellsUpdateFn={};
		this.cellsPrecisionDecimals = {};
		//do stuff
		this.createCellsSet();
		this.createCellsDependencies();
	},
	createCellsSet: function() {
		Object.each(this.options.cells, function(propertiesObj, name) {
			this.addCell(name, propertiesObj);
		}.bind(this));
	},
	createCellsDependencies: function() {
		Object.each(this.options.cells, function(propertiesObj, name) {
			Array.each(propertiesObj.dependsOn, function(dependantName) {
				var noLoop = true;
				if (this.cellsLinked[name]!=undefined) {
					if (this.cellsLinked[name].contains(dependantName)) {
						noLoop = false;
					}
				}
				if (noLoop) {
					if (this.cellsLinked[dependantName]===undefined) {
						this.cellsLinked[dependantName] = [];
					}
					this.cellsLinked[dependantName].push(name);
				}
				else {
					if (console!==undefined && console.log!==undefined) {
						console.log("[MooCells] Warning: cross reference -> ",dependantName, this.cellsEls[dependantName], name, this.cellsEls[name]);
					}
				}
			}.bind(this));
		}.bind(this));
	},
	addCell: function(name, propertiesObj) {
		this.cellsEls[name] = propertiesObj.el;
		if (typeOf(this.cellsEls[name]) == 'array') {
			var bridgeElement = new Element("input", {
				type: "text",
				"value": " ",
				styles: {
					"display": "none",
					"visibility": "hidden"
				}
			});
			Array.each(this.cellsEls[name], function(item) {
				item.addEvent("change", function(ev){
					this[1].set("value",this[0].get("value"));
					this[1].fireEvent("change");
				}.bind([item, bridgeElement]));
			}.bind(bridgeElement));
			this.cellsEls[name] = bridgeElement;
		}
		this.cells[name] = this._getCellValue(name);
		this.cellsGetter[name] = typeOf(propertiesObj.value) == 'function' ? propertiesObj.value : function() {};
		this.cellsLinked[name] = [];
		if (propertiesObj.status!==undefined) {
			if (propertiesObj.status == "readonly") {
				this.cellsEls[name].set("readonly","readonly");
			}
			else if (propertiesObj.status == "disabled") {
				this.cellsEls[name].set("disabled","disabled");
			}
		}
		this.cellsFormat[name] = propertiesObj.format===undefined ? "number" : propertiesObj.format;
		if (this.cellsFormat[name]=='boolean'){
			if (this.cellsEls[name].getProperty("type") == 'checkbox') {
				this.cells[name] = this.cellsEls[name].get("checked");
			}
		}
		else if (this.cellsFormat[name] == 'number') {
			this.cellsPrecisionDecimals[name] = this.options.format.decimals;
			if (propertiesObj.decimals!==undefined) {
				this.cellsPrecisionDecimals[name] = propertiesObj.decimals;
			}
		}
		this.cellsEls[name].addEvent("change", function(ev) {
			var name = this[1];
			var value = this[0]._getCellValue(name);
			this[0].updateCellValue(name,value);
		}.bind([this, name]));
		if (this.cellsEls[name].get("tag") == 'input'){
			if (this.cellsEls[name].getProperty("type") == 'radio') {
				this.cellsEls[name].addEvent("click", function(ev) {
					this[0].cellsEls[this[1]].set("checked", true);
					this[0].cellsEls[this[1]].setProperty("checked", 'checked');
					this[0].cellsEls[this[1]].fireEvent("change");
				}.bind([this, name]));
			}
		}
		this.cellsUpdateFn[name] = typeOf(propertiesObj.onUpdate) == 'function' ? propertiesObj.onUpdate : function() {};
	},
	updateCellValue : function(name, value) {
		var currentValue = this.getformattedCellValue(name,value);
		this.cells[name] = currentValue;
		this._setCellValue(name, currentValue);
		this.cellsUpdateFn[name](this.cells[name]);
		this.fireEvent("cellChange", [name, this.cells[name], this.cells]);
		Array.each(this.cellsLinked[name],function(item) {
			var value = this.getResultCellValue(item);
			this._setCellValue(item, value);
			this.cellsEls[item].fireEvent("change");
		}.bind(this));
	},
	_setCellValue: function(name, value) {
		var tag = this.cellsEls[name].get("tag");
		if (this.cellsFormat[name] == 'number') {
			value = new Number(value).toFixed(this.cellsPrecisionDecimals[name]).toString();
		}
		if (tag == 'select' || tag == 'textarea') {
			this.cellsEls[name].set("value",value);
		}
		else if(tag == 'input') {
			var type = this.cellsEls[name].getProperty("type");
			if (type=='text') {
				this.cellsEls[name].set("value",value);
			}
			else if(type=='chebox' || type=='radio') {
			}
		}
		else {
			this.cellsEls[name].set("text",value);
		}
	},
	_getCellValue: function(name) {
		var tag = this.cellsEls[name].get("tag");
		var value = "";
		if(tag == 'select' || tag == 'textarea') {
			value = this.cellsEls[name].get("value");
		}
		else if (tag == 'input') {
			var type = this.cellsEls[name].getProperty("type");
			if (type == 'checkbox' || type == 'radio') {
				if (this.cellsEls[name].get("checked")) {
					value = this.cellsEls[name].get("value");
				}
				else {
					value = "";
				}
			}
			else {
				value = this.cellsEls[name].get("value");
			}
		}
		else {
			value = this.cellsEls[name].get("text");
		}
		return value;
	},
	getformattedCellValue: function(name, value) {
		var currentValue;
		if (value!==undefined) {
			currentValue = value;
		}
		else {
			currentValue = this._getCellValue(name);
		}
		switch(this.cellsFormat[name]) {
			case "string":
				//currentValue = currentValue;
				var type = this.cellsEls[name].getProperty("type");
				if (type == "checkbox" || type == "radio" ) {
					var checked = this.cellsEls[name].get("checked");
					if (!checked) {
						currentValue = "";
					}
				}
				break;
			case "boolean":
				currentValue = currentValue.trim();
				currentValue = currentValue=='true'? true : false;
				var type = this.cellsEls[name].getProperty("type");
				if (type == "checkbox" || type == "radio" ) {
					currentValue = this.cellsEls[name].get("checked");
				}
				break;
			default:
				//number
				currentValue = currentValue.trim();
				currentValue = currentValue.replace(/,/g,'.');
				if (currentValue.split(".").length > 2) {
					currentValue = currentValue.replace(/[^\.\d\-]/g,"").replace(/\.(?!..$)/g,"").replace(/[^\d\.(?!..)-]/g,"").replace(/\.$/g,'').replace(/^-/g,"»").replace(/-/g,"").replace(/»/g,"-");
				}
				else {
					currentValue = currentValue.replace(/[^\.\d-]/g,"").replace(/^-/g,"»").replace(/-/g,"").replace(/»/g,"-");
				}
				currentValue = new Number(currentValue);
				if (currentValue==NaN) {
					currentValue = 0;
				}
		}
		return currentValue;
	},
	getScope: function(cells) {
		this.fireEvent("computing","start");
		var scope = {};
		var keys;
		if(cells!==undefined){
			keys = Array.from(cells);
		}
		else {
			keys = Object.keys(this.cells);
		}
		Array.each(keys, function(currentKey) {
			var executedValue = this.cellsGetter[currentKey](this.cells);
			if (executedValue===undefined) executedValue = null;
			scope[currentKey] = executedValue;
		}.bind(this));
		this.fireEvent("computing","end");
		return scope;
	},
	getResultCellValue: function(cell) {
		return this.getScope(cell)[cell];
	},
	updateAll: function() {
		Object.each(this.cells, function(value, key){
			this.updateCellValue(key);
		}.bind());
	}

});
*/
