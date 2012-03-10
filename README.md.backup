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

Options
-------

 * <b>cells</b>: an object {} containing the cells set (see below).
 * <b>format</b>: an object {} contaning information about how to format types. Now allowed value is:

```json
	format: {
		decimals: <number>
	}
```

Events
------
 * <b>onComputing</b> <i>(status)</i>: fired when calculating values. Argument status can be "<b>start</b>"|"<b>end</b>"
 * <b>onCellChange</b> <i>(cellName, cellValue , ScopedCells)</i>: fired when a cell changes its value. Arguments: <b>cellName</b> the key of the cell defined in cells set, <b>cellValue</b> the new value applied, <b>ScopedCells</b> the cell set object.

How to Setup Cells
------------------

For each cell you have to define a structure like this:

```json

	cellkey : { // (String)
		el: , // (Element - mandatory)
		status: , // (String - optional)
		format: , // (String - optional)
		decimals: , // (Number - optional)
		dependsOn: , //(Array[String] - optional)
		value: //(Function(cells) - optional),
		onUpdate: // Function(value) - optional
	}
```


* cellKey : <i>(String)</i> an unique name used to reference this cell in MooCell
* el: <i>(Element - mandatory)</i> the html element this cell is referring to
* status: <i>(String - optional)</i> This will be applied this value to the el. Can be 'readonly' or 'disabled'.
* format: <i>(String - optional)</i> Describe the type of data this cell is containing. Can be 'string', 'boolean', 'number'. 'number' is default.
* decimals: <i>(Number - optional)</i> If format is <b>'number'</b> you can use this to decide how many decimals the value of this cell has.
* dependsOn: <i>(Array[String] - optional)</i> The keys of the other cells this cell depends on.
* value: <i>(Function(cells))</i> - optional) This function will be used to calculate the value of the cell. One argument will be passed, an object with the cells.
* onUpdate: <i>(Function(value)</i> - optional) This function will be executed when the cell changes. The argument passed is the current value.