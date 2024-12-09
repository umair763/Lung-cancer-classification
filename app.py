import os
import tensorflow as tf
from flask import Flask, render_template, request, jsonify
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io

# Initialize Flask app
app = Flask(__name__)

# Load the trained model (make sure it's in the same directory as app.py or update the path)
model = tf.keras.models.load_model(
    "E:\\Code Playground\\Python Workspace\\6th semester\\AI Semester Project incr-2\\model\\lung_cancer_model_final.h5"
)

# Define class labels (modify these according to your model classes)
class_names = [
    "adenocarcinoma",
    "benign",
    "squamous_cell_carcinoma",
]  # Replace with actual class labels


def prepare_image(img):
    """Process the image for prediction."""
    img = img.resize((224, 224))  # Resize image to match model input
    img_array = np.array(img)  # Convert image to numpy array
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = img_array / 255.0  # Normalize the image
    return img_array


@app.route("/")
def index():
    """Render the homepage with the form."""
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    """Process the image, predict class, and return the result."""
    if "image" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Read and process the image
    img = Image.open(file.stream)
    img_array = prepare_image(img)

    # Make prediction
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction, axis=1)[
        0
    ]  # Get the index of the class with highest probability
    predicted_class_name = class_names[predicted_class]

    # Return prediction as a JSON response
    return jsonify({"prediction": predicted_class_name})


if __name__ == "__main__":
    app.run(debug=True)
