let selectedFile = null;

// Handle file selection
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
            // Hide upload section, show preview
            document.getElementById('uploadSection').style.display = 'none';
            document.getElementById('previewSection').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Analyze button click
document.getElementById('analyzeBtn').addEventListener('click', analyzeImage);

function analyzeImage() {
    if (!selectedFile) {
        alert('Please select an image first');
        return;
    }

    // Hide preview, show loading
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'block';

    // Loading animation with 5 second duration
    const loadingTexts = [
        'Initializing AI model...',
        'Processing image data...',
        'Extracting features...',
        'Running neural network...',
        'Analyzing patterns...',
        'Generating prediction...'
    ];

    let progress = 0;
    let textIndex = 0;
    const duration = 5000; // 5 seconds
    const interval = 100; // Update every 100ms

    const progressInterval = setInterval(() => {
        progress += (100 / (duration / interval));
        if (progress > 100) progress = 100;

        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('loadingPercentage').textContent = Math.floor(progress) + '%';

        // Change loading text every ~800ms
        if (progress % 17 < 2) {
            textIndex = Math.min(textIndex + 1, loadingTexts.length - 1);
            document.getElementById('loadingText').textContent = loadingTexts[textIndex];
        }
    }, interval);

    // Prepare FormData
    const formData = new FormData();
    formData.append('image', selectedFile);

    // Send to server
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Wait for loading animation to complete (minimum 5 seconds)
        setTimeout(() => {
            clearInterval(progressInterval);
            document.getElementById('loadingSection').style.display = 'none';

            if (data.error) {
                alert('Error: ' + data.error);
                resetUpload();
            } else {
                displayResults(data);
            }
        }, Math.max(0, 5000 - (Date.now() - startTime)));
    })
    .catch(error => {
        setTimeout(() => {
            clearInterval(progressInterval);
            document.getElementById('loadingSection').style.display = 'none';
            console.error('Error:', error);
            alert('Failed to classify the image. Please try again.');
            resetUpload();
        }, Math.max(0, 5000 - (Date.now() - startTime)));
    });

    const startTime = Date.now();
}

function displayResults(data) {
    // Set result image
    document.getElementById('resultImage').src = document.getElementById('previewImage').src;

    // Set prediction
    document.getElementById('predictionLabel').textContent = data.prediction.replace(/_/g, ' ');

    // Set confidence
    const confidenceValue = parseFloat(data.confidence);
    document.getElementById('confidenceValue').textContent = data.confidence;
    
    // Animate confidence bar
    setTimeout(() => {
        document.getElementById('confidenceFill').style.width = confidenceValue + '%';
    }, 300);

    // Display all predictions
    const predictionsList = document.getElementById('predictionsList');
    predictionsList.innerHTML = '';
    
    const sortedPredictions = Object.entries(data.all_predictions)
        .sort((a, b) => b[1] - a[1]);

    sortedPredictions.forEach(([className, percentage]) => {
        const item = document.createElement('div');
        item.className = 'prediction-item';
        item.innerHTML = `
            <span class="prediction-name">${className.replace(/_/g, ' ')}</span>
            <span class="prediction-percentage">${percentage.toFixed(2)}%</span>
        `;
        predictionsList.appendChild(item);
    });

    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function resetUpload() {
    selectedFile = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    
    // Reset progress
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('loadingPercentage').textContent = '0%';
    document.getElementById('loadingText').textContent = 'Initializing AI model...';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Drag and drop support for upload card
const uploadCard = document.querySelector('.upload-card');
if (uploadCard) {
    uploadCard.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadCard.style.borderColor = 'var(--primary-color)';
        uploadCard.style.background = '#f9fafb';
    });

    uploadCard.addEventListener('dragleave', () => {
        uploadCard.style.borderColor = 'var(--border-color)';
        uploadCard.style.background = 'transparent';
    });

    uploadCard.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadCard.style.borderColor = 'var(--border-color)';
        uploadCard.style.background = 'transparent';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewImage').src = e.target.result;
                document.getElementById('uploadSection').style.display = 'none';
                document.getElementById('previewSection').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}
