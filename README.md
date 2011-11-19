MooCells
========

It helps you to develop javascript enhanced forms defining relationship between elements.

Quickly, it make possible to calcute element values like in spreadsheets.


Demo
----

http://nkjoep.github.com/MooCells/


How to Make It Run
---------------

Import the Mootool library and the MooCell library in the middle of your <head>

```html

	<head>
		<script type="text/javascript" src="mootools.js" />
		<script type="text/javascript" src="MooCells.js" />
	</head>
```



99.999% of times you surely need a good domready

```html
	<script type="text/javascript">
		window.addEvent("domready", function(){
			//second step here						
		});
	</script>
```


Create an instance of MooCells in the function passed to the domready event

```html
	<script type="text/javascript">
		window.addEvent("domready", function(){
			new MooCells({
				cells: {
					cellA: {
						el: document.id("idForCellA"),
					},
					cellB: {
						el: document.id("idForCellB"),
						status: "disabled",
						value: function(cells) {
							return cells.cellA * 5
						}
					}
				},
				onComputing: function(status) {
					console.log("calculating cells values - ", status);
				},
				onCellChange: function(cell) {
					console.log(cell, "has changed");
				}
			});
		});
	</script>
```



How to Setup Cells
------------------

For each cell you have to define a structure like this:

```json

	cellkey : { // (String)
		el: , // (Element - mandatory)
		status: , // (String - optional)
		format: , // (String - optional)
		dependsOn: , //(Array[String] - optional)
		value: //(Function(cells) - optional)
	}
```


* cellKey : (String) an unique name used to reference this cell in MooCell
* el: (Element - mandatory) the html element this cell is referring to
* status: (String - optional) This will be applied this value to the el. Can be 'readonly' or 'disabled'.
* format: (String - optional) Describe the type of data this cell is containing. Can be 'string', 'boolean', 'number'. 'number' is default.
* dependsOn: (Array[String] - optional) The keys of the other cells this cell depends on.
* value: (Function(cells) - optional) This function will be used to calculate the value of the cell. One argument will be passed, an object with the cells.



