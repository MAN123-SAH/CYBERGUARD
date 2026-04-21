class FeatureService:
    def preprocess_url(self, url: str):
        """
        Perform any necessary preprocessing on the URL before vectorization.
        For now, we assume the vectorizer handles the raw URL or simple string cleanup.
        """
        # Basic cleanup: remove whitespace
        clean_url = url.strip()
        return clean_url

feature_service = FeatureService()
