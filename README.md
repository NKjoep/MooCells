MooCells
========

It helps you to develop javascript enhanced forms defining relationship between elements.

Quickly, it make possible to calcute element values like in spreadsheets.


Demo
----

http://nkjoep.github.com/MooCells/


How Make It Run
---------------

Import the Mootool library and the MooCell library in the middle of your <head>


<pre>
	&lt;head>
		&lt;script type="text/javascript" src="mootools.js" />
		&lt;script type="text/javascript" src="MooCells.js" />
	&lt;/head>
</pre>



99.999% of times you surely need a good domready


	<script type="text/javascript">
		window.addEvent("domready", function(){
			//second step here						
		});
	</script>



Create an instance of MooCells in the function passed to the domready event


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




How to Setup Cells
------------------

//todo

