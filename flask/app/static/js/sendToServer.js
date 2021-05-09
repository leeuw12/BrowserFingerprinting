var submit_message = function() {
	fingerprint = document.getElementById('fingerprint').innerHTML;
	browser = document.getElementById('browser').innerHTML;
	var entry = {
		fingerprint: fingerprint,
		browser: browser
	};
	fetch(`${window.origin}/foo`, {
		method: "POST",
		credentials: "include",
		body: JSON.stringify(entry),
		cache: "no-cache",
		headers: new Headers({
			"content-type": "application/json"
		})
	}).then(function(response) {
		if (response.status !== 200) {
			console.log(`Looks like there was a problem. Status code: ${response.status}`);
			return;
		}
		response.json().then(function(data) {
			console.log(data);
		});
	}).catch(function(error) {
		console.log("Fetch error: " + error);
	});
}