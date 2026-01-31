import pandas as pd
import numpy as np

def add_technical_features(data: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Returns:
        tuple: (training_data, latest_data_point)
    """
    df = data.copy()
    
    # 1. Technical Indicators
    df['Lag_1'] = df['Close'].shift(1)
    df['Lag_2'] = df['Close'].shift(2)
    df['MA_5'] = df['Close'].rolling(window=5).mean()
    df['MA_20'] = df['Close'].rolling(window=20).mean()

    # RSI Calculation
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))

    # 2. CLEANUP
    # Drop initial NaNs created by rolling windows
    df = df.dropna()
    
    if df.empty:
        raise ValueError("Not enough data to calculate technical indicators")

    # 3. SEPARATE LATEST ROW (For Prediction)
    # We grab the very last row *before* creating targets. 
    # This row has 'Close', 'MA_5', etc. but NO 'Target_Price' yet.
    latest_row = df.iloc[[-1]].copy()

    # 4. CREATE TARGETS (For Training)
    # Target is "Next Day's Price"
    df['Target_Price'] = df['Close'].shift(-1)
    df['Target_UpDown'] = (df['Close'].shift(-1) > df['Close']).astype(int)

    # 5. REMOVE LAST ROW FROM TRAINING
    # The last row has a NaN target (because tomorrow hasn't happened), so we drop it.
    training_data = df.dropna()

    return training_data, latest_row