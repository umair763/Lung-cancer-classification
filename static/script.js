const wrapperAdjustment = document.getElementById("wrapperAD");
wrapperAdjustment.classList.remove("wrapperAdjust");

// Function to trigger file input when the container is clicked
function triggerFileInput() {
	document.getElementById("fileInput").click();
}

// Handle file input selection
function handleImageSelection(event) {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = function (e) {
			const imageUrl = e.target.result;
			document.getElementById("uploadedImage").src = imageUrl;
		};
		reader.readAsDataURL(file);
	}
}

// Handle image drop
function allowDrop(event) {
	event.preventDefault();
}

function handleDrop(event) {
	event.preventDefault();
	const file = event.dataTransfer.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = function (e) {
			const imageUrl = e.target.result;
			document.getElementById("uploadedImage").src = imageUrl;
		};
		reader.readAsDataURL(file);
	}
}

// Function to classify the uploaded image
function classifyImage() {
	// Hide image guidelines
	document.getElementById("guidelines").classList.add("guidelines-hidden");

	// Show loading bar
	document.getElementById("loadingBar").style.display = "block";

	const fileInput = document.getElementById("fileInput");
	const file = fileInput.files[0];
	if (!file) {
		alert("Please upload an image.");
		return;
	}

	// Create FormData and append the file
	const formData = new FormData();
	formData.append("image", file);

	// Send image to the backend
	fetch("/predict", {
		method: "POST",
		body: formData,
	})
		.then((response) => response.json())
		.then((data) => {
			setTimeout(() => {
				document.getElementById("loadingBar").style.display = "none";
			}, 2000);

			if (data.error) {
				alert("Error: " + data.error);
			} else {
				setTimeout(() => {
					document.getElementById("prediction").textContent = `${data.prediction} `;
					document.getElementById("confidence").textContent = `${data.confidence}`;
					document.getElementById("result").classList.add("visible");
				}, 2000);
			}
		})
		.catch((error) => {
			setTimeout(() => {
				document.getElementById("loadingBar").style.display = "none";
			}, 2000);
			console.error("Error:", error);
			alert("Failed to classify the image. Please try again.");
		});
}

// Modify the toggleDetails function
function toggleDetails() {
	const slidingDetails = document.getElementById("slidingDetails");
	const wrapperAdjustment = document.getElementById("wrapperAD");

	// Toggle the 'open' class to slide in or out the sliding details
	if (slidingDetails.classList.contains("open")) {
		slidingDetails.classList.remove("open");
		// Hide the sliding details by setting display to 'none' when it's closed
		slidingDetails.style.display = "none";
		// Remove the 'wrapperAdjust' class when sliding details are closed
		wrapperAdjustment.classList.remove("wrapperAdjust");
	} else {
		slidingDetails.classList.add("open");
		// Display the sliding details when it's opened
		slidingDetails.style.display = "block";
		// Add the 'wrapperAdjust' class when sliding details are opened
		wrapperAdjustment.classList.add("wrapperAdjust");
	}

	const slidingDetailsLeft = document.getElementById("slidingDetailsLeft");

	// Toggle the 'open' class for the left sidebar
	if (slidingDetailsLeft.classList.contains("open")) {
		slidingDetailsLeft.classList.remove("open");
		slidingDetailsLeft.style.display = "none";
		wrapperAdjustment.classList.remove("wrapperAdjust");
	} else {
		slidingDetailsLeft.classList.add("open");
		slidingDetailsLeft.style.display = "block";
		wrapperAdjustment.classList.add("wrapperAdjust");
	}
}
