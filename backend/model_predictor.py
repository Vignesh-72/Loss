from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np

class StockPredictor:
    def __init__(self):
        # AI Models
        self.reg_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.clf_model = LogisticRegression(max_iter=2000, random_state=42)
        self.scaler = StandardScaler()
        
        # The specific columns the AI looks at
        self.features = ['Lag_1', 'Lag_2', 'MA_5', 'MA_20', 'RSI']
    
    def prepare_data(self, data: pd.DataFrame):
        X = data[self.features]
        y_reg = data['Target_Price']
        y_clf = data['Target_UpDown']
        
        # Scale features (0 to 1 range) so models don't get confused
        X_scaled = self.scaler.fit_transform(X)
        
        return X_scaled, y_reg, y_clf
    
    def train(self, X, y_reg, y_clf):
        self.reg_model.fit(X, y_reg)
        self.clf_model.fit(X, y_clf)
    
    def predict(self, latest_features: pd.DataFrame):
        """Predicts a single step into the future"""
        # Must scale input using the same scaler as training
        X_scaled = self.scaler.transform(latest_features[self.features])
        
        price = self.reg_model.predict(X_scaled)[0]
        direction = self.clf_model.predict(X_scaled)[0]
        
        return price, direction