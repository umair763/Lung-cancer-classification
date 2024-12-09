// Handling the image upload and prediction result
const form = document.getElementById('uploadForm');
const resultDiv = document.getElementById('result');
const predictionSpan = document.getElementById('prediction');
const uploadedImage = document.getElementById('uploadedImage');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    // Display the uploaded image
    const file = formData.get('image');
    const reader = new FileReader();

    reader.onload = function () {
        uploadedImage.src = reader.result;
    };
    reader.readAsDataURL(file);

    // Show a loading message while waiting for the result
    predictionSpan.textContent = 'Classifying...';
    resultDiv.style.display = 'block';

    // Use fetch to submit the form data
    fetch('/predict', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            predictionSpan.textContent = data.prediction;
        })
        .catch((error) => {
            console.error('Error:', error);
            predictionSpan.textContent = 'Error in classification.';
        });
});
