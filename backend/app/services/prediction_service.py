from app.models.model_loader import model_loader
from app.services.feature_service import feature_service
import pandas as pd

class PredictionService:
    def predict(self, url: str):
        # 1. Preprocess
        clean_url = feature_service.preprocess_url(url)
        
        # 2. Vectorize
        vectorized_text = model_loader.vectorizer.transform([clean_url])
        
        # 3. Model Predictions (LR, NB, XGB)
        # Logistic Regression
        lr_pred = model_loader.lr_model.predict(vectorized_text)[0]
        lr_conf = model_loader.lr_model.predict_proba(vectorized_text)[0].max()
        
        # Naive Bayes
        nb_pred = model_loader.nb_model.predict(vectorized_text)[0]
        nb_conf = model_loader.nb_model.predict_proba(vectorized_text)[0].max()
        
        # XGBoost
        xgb_pred = model_loader.xgb_model.predict(vectorized_text)[0]
        xgb_conf = model_loader.xgb_model.predict_proba(vectorized_text)[0].max()
        
        # 4. Majority Voting (3 Models)
        predictions = [lr_pred, nb_pred, xgb_pred]
        
        # --- REVERSE LOGIC FIX: 0=Phishing, 1=Safe ---
        phishing_count = sum(1 for p in predictions if str(p) == '0')
        
        # Sensitivity: 1 or more flags triggers "Phishing/Suspicious" status
        final_prediction = "Phishing" if phishing_count >= 1 else "Legitimate"
        
        return {
            "url": url,
            "models": {
                "lr": {"prediction": str(lr_pred), "confidence": float(lr_conf)},
                "nb": {"prediction": str(nb_pred), "confidence": float(nb_conf)},
                "xgb": {"prediction": str(xgb_pred), "confidence": float(xgb_conf)}
            },
            "final_prediction": final_prediction,
            "votes": {
                "phishing": phishing_count,
                "legitimate": 3 - phishing_count
            }
        }

prediction_service = PredictionService()
