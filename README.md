MooCells
========

It helps you to develop javascript enhanced forms defining relationship between elements.

Quickly, it make possible to calcute element values like in spreadsheets.


Demo
----

http://nkjoep.github.com/MooCells/


How Make It Run
---------------

0. Import the Mootool library and the MooCell library in the middle of your <head>

<pre>
	<head>
		<script type="text/javascript" src="mootools.js" />
		<script type="text/javascript" src="MooCells.js" />
	</head>
</pre>

1. 99.999% of times you surely need a good domready

<pre>
	<script type="text/javascript">
		window.addEvent("domready", function(){
			//second step here						
		});
	</script>
</pre>

2. Create an instance of MooCells in the function passed to the domready event

<pre>
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
</pre>

How to Setup Cells
------------------

//todo

