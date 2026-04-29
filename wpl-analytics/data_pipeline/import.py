import pandas as pd
import pymongo
from datetime import datetime

print("🔄 Connecting to MongoDB...")
client = pymongo.MongoClient('mongodb://localhost:27017')
db = client['wpl_analytics']
players_coll = db['players']

print("📖 Reading Excel file...")
df = pd.read_excel('Mega proj 1 final IMP.xlsx', sheet_name='Players')
print(f"✅ Loaded {len(df)} records")

print("🔍 Finding unique players...")
unique = df[['Player_id', 'player_name', 'team', 'role']].drop_duplicates()
print(f"✅ Found {len(unique)} unique players")

print("💾 Inserting players into database...")
for idx, row in unique.iterrows():
    doc = {
        'player_id': str(row['Player_id']),
        'name': str(row['player_name']),
        'team': str(row['team']),
        'role': str(row['role']),
        'seasonal_stats': {},
        'updated_at': datetime.now()
    }
    players_coll.update_one(
        {'player_id': doc['player_id']}, 
        {'$set': doc}, 
        upsert=True
    )
    if (idx + 1) % 50 == 0:
        print(f"   ✅ Inserted {idx + 1}/{len(unique)} players...")

print("📊 Generating seasonal statistics...")
for player_id in unique['Player_id'].unique():
    player_data = df[df['Player_id'] == player_id]
    
    for season in player_data['Season'].unique():
        season_data = player_data[player_data['Season'] == season]
        
        stats = {
            'matches': int(len(season_data)),
            'runs': int(season_data['runs_scored'].sum()),
            'avg': round(float(season_data['runs_scored'].mean()), 2),
            'sr': round(float(season_data['strike_rate'].mean()), 2),
            'wickets': int(season_data['wickets_taken'].sum()),
        }
        
        players_coll.update_one(
            {'player_id': str(player_id)},
            {'$set': {f'seasonal_stats.{int(season)}': stats}}
        )

count = players_coll.count_documents({})
print(f"\n🎉 SUCCESS! {count} players in database")