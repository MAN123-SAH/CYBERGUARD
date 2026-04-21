import pickle
import os
from pathlib import Path

# Paths to models relative to the backend folder
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH_NB = BASE_DIR / "nb (1).pkl"
MODEL_PATH_LR = BASE_DIR / "phishing (1).pkl"
MODEL_PATH_XGB = BASE_DIR / "xgb (1).pkl"
MODEL_PATH_VEC = BASE_DIR / "vectorizer (1).pkl"

class ModelLoader:
    def __init__(self):
        self.vectorizer = None
        self.nb_model = None
        self.lr_model = None
        self.xgb_model = None
        self.load_models()

    def load_models(self):
        try:
            print("Loading models (NB, LR, XGB)...")
            with open(MODEL_PATH_VEC, 'rb') as f:
                self.vectorizer = pickle.load(f)
            with open(MODEL_PATH_NB, 'rb') as f:
                self.nb_model = pickle.load(f)
            with open(MODEL_PATH_LR, 'rb') as f:
                self.lr_model = pickle.load(f)
            with open(MODEL_PATH_XGB, 'rb') as f:
                self.xgb_model = pickle.load(f)
            print("All models loaded successfully.")
        except Exception as e:
            print(f"Error loading models: {e}")
            raise e

# Create a singleton instance
model_loader = ModelLoader()
