import os
import tensorflow as tf
from flask import Flask, render_template, request, jsonify
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model_path = "E:\\Github Repo\\AI Semester Project incr-2\\model\\lung_cancer_model_final.h5"
model = tf.keras.models.load_model(model_path)

# Define class labels
class_names = ["adenocarcinoma", "benign", "squamous_cell_carcinoma"]

def prepare_image(img):
    """Prepare the image for prediction."""
    img = img.resize((224, 224))  # Resize to match model input
    img_array = np.array(img)  # Convert to numpy array
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = img_array / 255.0  # Normalize to [0, 1]
    return img_array

@app.route("/")
def index():
    """Serve the HTML frontend."""
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    """Process image upload and return prediction."""
    if "image" not in request.files:
        return jsonify({"error": "No image file uploaded."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    try:
        # Open and process the image
        img = Image.open(file.stream)
        img_array = prepare_image(img)

        # Predict using the model
        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions, axis=1)[0]
        predicted_class = class_names[predicted_index]
        confidence = f"{np.max(predictions) * 100:.2f}%"

        return jsonify({
            "prediction": predicted_class,
            "confidence": confidence
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
