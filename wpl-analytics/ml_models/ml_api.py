from flask import Flask, request, jsonify
from flask_cors import CORS
from train_model import WPLPlayerPredictor
import requests
import json
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

predictor = WPLPlayerPredictor()

try:
    predictor.load_model()
    print("✅ Loaded existing ML model")
except:
    print("⚠️ No existing model found. Train one first!")

NODE_API_URL = os.getenv('NODE_API_URL', 'http://localhost:5000')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'ML Prediction API',
        'model_loaded': predictor.model is not None
    })

@app.route('/predict/runs', methods=['POST'])
def predict_runs():
    try:
        data = request.json
        player_data = data.get('player', {})
        
        prediction = predictor.predict_runs(player_data)
        
        if prediction is None:
            return jsonify({'error': 'Model not trained'}), 400
        
        return jsonify({
            'success': True,
            'prediction': prediction,
            'timestamp': str(datetime.now())
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/form', methods=['POST'])
def predict_form():
    try:
        data = request.json
        player_data = data.get('player', {})
        
        form = predictor.predict_form(player_data)
        
        return jsonify({
            'success': True,
            'form': form,
            'timestamp': str(datetime.now())
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/train', methods=['POST'])
def train_model():
    try:
        print("🤖 Fetching player data...")
        
        response = requests.get(f'{NODE_API_URL}/api/players')
        if response.status_code != 200:
            return jsonify({'error': 'Could not fetch player data'}), 400
        
        players = response.json()
        print(f"✅ Got {len(players)} players")
        
        metrics = predictor.train(players)
        predictor.save_model()
        
        return jsonify({
            'success': True,
            'message': 'Model trained successfully',
            'metrics': metrics,
            'players_used': len(players)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    try:
        data = request.json
        players = data.get('players', [])
        
        results = []
        for player in players:
            prediction = predictor.predict_runs(player)
            form = predictor.predict_form(player)
            
            results.append({
                'playerId': player.get('_id') or player.get('id'),
                'name': player.get('name'),
                'prediction': prediction,
                'form': form
            })
        
        return jsonify({
            'success': True,
            'results': results,
            'count': len(results)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/model/metrics', methods=['GET'])
def get_metrics():
    try:
        if predictor.model is None:
            return jsonify({'error': 'Model not trained'}), 400
        
        return jsonify({
            'success': True,
            'model_type': 'Random Forest Regressor',
            'features': predictor.feature_names,
            'n_estimators': 100,
            'max_depth': 15,
            'status': 'ready'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 ML Prediction API Server")
    print("=" * 50)
    print("Endpoints:")
    print("  POST /predict/runs - Predict player runs")
    print("  POST /predict/form - Predict player form")
    print("  POST /train - Train model with fresh data")
    print("  POST /batch-predict - Predict for multiple players")
    print("  GET  /model/metrics - Get model metrics")
    print("  GET  /health - Health check")
    print("=" * 50)
    app.run(debug=True, port=5001)