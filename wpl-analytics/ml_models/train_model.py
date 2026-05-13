import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json
from datetime import datetime
import requests
import os
from dotenv import load_dotenv

load_dotenv()

class WPLPlayerPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = None
        
    def extract_player_stats(self, player):
        """Extract aggregated stats from seasonal_stats"""
        
        seasonal_stats = player.get('seasonal_stats', {})
        
        if not seasonal_stats:
            return {
                'name': player.get('name', ''),
                'team': player.get('team', ''),
                'role': player.get('role', ''),
                'totalRuns': 0,
                'matches': 0,
                'average': 0,
                'strikeRate': 0,
                'wickets': 0
            }
        
        total_runs = 0
        total_matches = 0
        total_wickets = 0
        total_balls = 0
        
        season_averages = []
        season_strike_rates = []
        
        for season_id, stats in seasonal_stats.items():
            runs = stats.get('runs', 0)
            matches = stats.get('matches', 0)
            balls = stats.get('balls', 0)
            wickets = stats.get('wickets', 0)
            avg = stats.get('avg', 0)
            sr = stats.get('sr', 0)
            
            total_runs += runs
            total_matches += matches
            total_balls += balls
            total_wickets += wickets
            
            if avg > 0:
                season_averages.append(avg)
            if sr > 0:
                season_strike_rates.append(sr)
        
        avg_average = np.mean(season_averages) if season_averages else 0
        avg_strike_rate = np.mean(season_strike_rates) if season_strike_rates else 0
        
        return {
            'name': player.get('name', ''),
            'team': player.get('team', ''),
            'role': player.get('role', ''),
            'totalRuns': total_runs,
            'matches': total_matches,
            'average': avg_average,
            'strikeRate': avg_strike_rate,
            'wickets': total_wickets
        }
    
    def prepare_data(self, raw_players):
        """Prepare and clean data from seasonal_stats"""
        
        print(f"\n📊 Extracting stats from {len(raw_players)} players...")
        
        extracted_data = []
        for player in raw_players:
            stats = self.extract_player_stats(player)
            if stats['matches'] > 0:
                extracted_data.append(stats)
        
        print(f"✅ Extracted {len(extracted_data)} players with valid stats")
        
        df = pd.DataFrame(extracted_data)
        df = df.fillna(0)
        
        return df
    
    def create_features(self, df):
        """Extract features for ML model"""
        
        required_cols = ['totalRuns', 'matches', 'average', 'strikeRate', 'wickets']
        for col in required_cols:
            if col not in df.columns:
                df[col] = 0
        
        df['runs_per_match'] = df['totalRuns'] / (df['matches'] + 1)
        df['consistency_score'] = (df['average'] * df['matches']) / 100
        df['performance_score'] = df['strikeRate'] * (df['average'] / 50)
        
        feature_cols = ['totalRuns', 'matches', 'average', 'strikeRate', 'wickets', 
                       'runs_per_match', 'consistency_score', 'performance_score']
        
        df = df.replace([np.inf, -np.inf], 0)
        
        X = df[feature_cols].values.astype(np.float64)
        y = df['totalRuns'].values.astype(np.float64)
        
        self.feature_names = feature_cols
        
        return X, y, df
    
    def train(self, raw_players):
        """Train the ML model"""
        print("\n🤖 Training ML Model...")
        
        df = self.prepare_data(raw_players)
        
        if len(df) < 10:
            raise ValueError(f"Not enough data to train. Need at least 10 samples, got {len(df)}")
        
        print(f"✅ Prepared {len(df)} players")
        print(f"   Avg Runs: {df['totalRuns'].mean():.2f}")
        print(f"   Avg Matches: {df['matches'].mean():.2f}")
        print(f"   Avg Strike Rate: {df['strikeRate'].mean():.2f}")
        
        X, y, df = self.create_features(df)
        
        valid_indices = ~(np.isinf(X).any(axis=1) | np.isnan(X).any(axis=1))
        X = X[valid_indices]
        y = y[valid_indices]
        
        print(f"✅ Valid samples: {len(X)}")
        
        test_size = max(int(len(X) * 0.2), 5)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        print(f"📊 Training set: {len(X_train)} samples")
        print(f"📊 Test set: {len(X_test)} samples")
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        self.model = RandomForestRegressor(
            n_estimators=50,
            max_depth=10,
            min_samples_split=3,
            min_samples_leaf=1,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        y_pred = self.model.predict(X_test_scaled)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        rmse = np.sqrt(mse)
        
        print(f"\n✅ Model Trained Successfully!")
        print(f"   R² Score: {r2:.4f}")
        print(f"   RMSE: {rmse:.2f}")
        print(f"   MSE: {mse:.2f}\n")
        
        return {
            'r2_score': float(r2),
            'rmse': float(rmse),
            'mse': float(mse),
            'samples': len(X_train),
            'trained_at': datetime.now().isoformat()
        }
    
    def predict_runs(self, player_data):
        """Predict next match runs for a player"""
        if self.model is None:
            return None
        
        features = np.array([
            player_data.get('totalRuns', 0),
            player_data.get('matches', 1),
            player_data.get('average', 0),
            player_data.get('strikeRate', 0),
            player_data.get('wickets', 0),
            player_data.get('totalRuns', 0) / (player_data.get('matches', 1) + 1),
            (player_data.get('average', 0) * player_data.get('matches', 0)) / 100,
            player_data.get('strikeRate', 0) * (player_data.get('average', 0) / 50)
        ]).reshape(1, -1).astype(np.float64)
        
        features_scaled = self.scaler.transform(features)
        prediction = self.model.predict(features_scaled)[0]
        confidence = min(100, (player_data.get('matches', 0) / 20) * 100)
        
        return {
            'predicted_runs': max(0, float(prediction)),
            'confidence': float(confidence),
            'average': float(player_data.get('average', 0)),
            'strike_rate': float(player_data.get('strikeRate', 0))
        }
    
    def predict_form(self, player_data):
        """Predict player form - improved calculation"""
        avg = player_data.get('average', 0)
        sr = player_data.get('strikeRate', 0)
        matches = player_data.get('matches', 0)

        # Normalize scores to 0-100 scale
        avg_score = min((avg / 40) * 100, 100)      # 40 is good average
        sr_score = min((sr / 150) * 100, 100)        # 150 is good strike rate
        matches_score = min((matches / 15) * 100, 100)  # 15+ matches is good

        # Calculate form score
        form_score = (avg_score * 0.35) + (sr_score * 0.35) + (matches_score * 0.30)

        if form_score >= 70:
            form = 'Excellent'
        elif form_score >= 50:
            form = 'Good'
        elif form_score >= 30:
            form = 'Average'
        else:
            form = 'Poor'

        return {
            'form': form,
            'form_score': float(form_score),
            'confidence': float(min(100, (matches / 15) * 100))
        }
    
    def save_model(self, path='player_model.pkl'):
        """Save trained model"""
        joblib.dump(self.model, path)
        joblib.dump(self.scaler, 'scaler.pkl')
        print(f"✅ Model saved to {path}")
        print(f"✅ Scaler saved to scaler.pkl")
    
    def load_model(self, path='player_model.pkl'):
        """Load trained model"""
        try:
            self.model = joblib.load(path)
            self.scaler = joblib.load('scaler.pkl')
            print(f"✅ Model loaded from {path}")
            return True
        except:
            print(f"⚠️ Could not load model from {path}")
            return False


def fetch_players_from_backend():
    """Fetch player data from Node backend"""
    print("🔗 Fetching player data from backend...")
    
    NODE_API_URL = os.getenv('NODE_API_URL', 'http://localhost:5000')
    
    try:
        response = requests.get(f'{NODE_API_URL}/api/players', timeout=10)
        if response.status_code == 200:
            players = response.json()
            print(f"✅ Got {len(players)} players from backend")
            return players
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend at " + NODE_API_URL)
        print("⚠️ Make sure Node backend is running: npm start")
        return None
    except Exception as e:
        print(f"❌ Error fetching data: {str(e)}")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("🤖 WPL Player Performance ML Model - Training Script")
    print("=" * 60)
    
    players = fetch_players_from_backend()
    
    if players is None:
        print("\n❌ FAILED TO FETCH PLAYER DATA")
        print("\n📝 SOLUTION:")
        print("   1. Make sure backend is running: npm start")
        print("   2. Check NODE_API_URL in .env file")
        exit(1)
    
    if len(players) == 0:
        print("\n❌ No players found in database")
        exit(1)
    
    predictor = WPLPlayerPredictor()
    
    try:
        metrics = predictor.train(players)
        predictor.save_model()
        
        print("\n📊 TRAINING SUMMARY")
        print("=" * 60)
        print(json.dumps(metrics, indent=2))
        print("=" * 60)
        print("\n✅ Training Complete!")
        print("   Model: player_model.pkl")
        print("   Scaler: scaler.pkl")
        print("\n🚀 Next: Start Flask API with: python ml_api.py")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Training failed: {str(e)}")
        import traceback
        traceback.print_exc()
        exit(1)