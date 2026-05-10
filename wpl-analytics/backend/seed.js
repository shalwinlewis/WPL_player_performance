const mongoose = require('mongoose');
require('dotenv').config();
const Player = require('./models/Player');

const players = [
  {
    "player_id": "P001",
    "name": "Beth Mooney",
    "team": "GGTW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "1": {
        "matches": 1,
        "runs": 0,
        "balls": 3,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      },
      "2": {
        "matches": 8,
        "runs": 285,
        "balls": 202,
        "wickets": 0,
        "impact": 302.05,
        "avg": 35.62,
        "sr": 141.09
      },
      "3": {
        "matches": 9,
        "runs": 237,
        "balls": 185,
        "wickets": 0,
        "impact": 281.0,
        "avg": 26.33,
        "sr": 128.11
      },
      "4": {
        "matches": 9,
        "runs": 258,
        "balls": 211,
        "wickets": 0,
        "impact": 305.0,
        "avg": 28.67,
        "sr": 122.27
      }
    }
  },
  {
    "player_id": "P002",
    "name": "Sabbhineni Meghana",
    "team": "GGTW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 6,
        "runs": 81,
        "balls": 81,
        "wickets": 0,
        "impact": 81.91,
        "avg": 13.5,
        "sr": 100.0
      },
      "2": {
        "matches": 7,
        "runs": 168,
        "balls": 149,
        "wickets": 0,
        "impact": 179.34,
        "avg": 24.0,
        "sr": 112.75
      },
      "3": {
        "matches": 2,
        "runs": 53,
        "balls": 25,
        "wickets": 0,
        "impact": 80.0,
        "avg": 26.5,
        "sr": 212.0
      }
    }
  },
  {
    "player_id": "P003",
    "name": "Harleen Deol",
    "team": "GGTW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 202,
        "balls": 161,
        "wickets": 1,
        "impact": 284.58,
        "avg": 25.25,
        "sr": 125.47
      },
      "2": {
        "matches": 3,
        "runs": 48,
        "balls": 64,
        "wickets": 0,
        "impact": 46.1,
        "avg": 16.0,
        "sr": 75.0
      },
      "3": {
        "matches": 9,
        "runs": 232,
        "balls": 192,
        "wickets": 0,
        "impact": 288.0,
        "avg": 25.78,
        "sr": 120.83
      },
      "4": {
        "matches": 8,
        "runs": 167,
        "balls": 144,
        "wickets": 0,
        "impact": 190.0,
        "avg": 20.88,
        "sr": 115.97
      }
    }
  },
  {
    "player_id": "P004",
    "name": "Ashleigh Gardner",
    "team": "GGTW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 204,
        "balls": 144,
        "wickets": 10,
        "impact": 484.25,
        "avg": 25.5,
        "sr": 141.67
      },
      "2": {
        "matches": 8,
        "runs": 120,
        "balls": 108,
        "wickets": 7,
        "impact": 234.1,
        "avg": 15.0,
        "sr": 111.11
      },
      "3": {
        "matches": 9,
        "runs": 243,
        "balls": 148,
        "wickets": 8,
        "impact": 525.0,
        "avg": 27.0,
        "sr": 164.19
      },
      "4": {
        "matches": 9,
        "runs": 244,
        "balls": 172,
        "wickets": 6,
        "impact": 445.0,
        "avg": 27.11,
        "sr": 141.86
      }
    }
  },
  {
    "player_id": "P005",
    "name": "Annabel Sutherland",
    "team": "GGTW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 5,
        "runs": 28,
        "balls": 36,
        "wickets": 4,
        "impact": 74.67,
        "avg": 5.6,
        "sr": 77.78
      },
      "2": {
        "matches": 3,
        "runs": 27,
        "balls": 23,
        "wickets": 0,
        "impact": 44.8,
        "avg": 9.0,
        "sr": 117.39
      },
      "3": {
        "matches": 9,
        "runs": 95,
        "balls": 78,
        "wickets": 9,
        "impact": 349.0,
        "avg": 10.56,
        "sr": 121.79
      }
    }
  },
  {
    "player_id": "P006",
    "name": "Dayalan Hemalatha",
    "team": "GGTW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 151,
        "balls": 96,
        "wickets": 0,
        "impact": 260.6,
        "avg": 18.88,
        "sr": 157.29
      },
      "2": {
        "matches": 8,
        "runs": 115,
        "balls": 89,
        "wickets": 0,
        "impact": 121.59,
        "avg": 14.38,
        "sr": 129.21
      },
      "3": {
        "matches": 6,
        "runs": 27,
        "balls": 48,
        "wickets": 0,
        "impact": 27.0,
        "avg": 4.5,
        "sr": 56.25
      },
      "4": {
        "matches": 3,
        "runs": 11,
        "balls": 20,
        "wickets": 0,
        "impact": -5.0,
        "avg": 3.67,
        "sr": 55.0
      }
    }
  },
  {
    "player_id": "P007",
    "name": "Georgia Wareham",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 2,
        "runs": 30,
        "balls": 36,
        "wickets": 1,
        "impact": 30.18,
        "avg": 15.0,
        "sr": 83.33
      },
      "2": {
        "matches": 10,
        "runs": 111,
        "balls": 68,
        "wickets": 7,
        "impact": 233.36,
        "avg": 11.1,
        "sr": 163.24
      },
      "3": {
        "matches": 8,
        "runs": 93,
        "balls": 68,
        "wickets": 12,
        "impact": 441.0,
        "avg": 11.62,
        "sr": 136.76
      },
      "4": {
        "matches": 8,
        "runs": 178,
        "balls": 123,
        "wickets": 7,
        "impact": 382.0,
        "avg": 22.25,
        "sr": 144.72
      }
    }
  },
  {
    "player_id": "P008",
    "name": "Sneh Rana",
    "team": "GGTW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 34,
        "balls": 34,
        "wickets": 6,
        "impact": 144.61,
        "avg": 4.25,
        "sr": 100.0
      },
      "2": {
        "matches": 4,
        "runs": 13,
        "balls": 14,
        "wickets": 0,
        "impact": 24.9,
        "avg": 3.25,
        "sr": 92.86
      },
      "3": {
        "matches": 5,
        "runs": 27,
        "balls": 7,
        "wickets": 6,
        "impact": 197.0,
        "avg": 5.4,
        "sr": 385.71
      },
      "4": {
        "matches": 10,
        "runs": 62,
        "balls": 49,
        "wickets": 1,
        "impact": 75.0,
        "avg": 6.2,
        "sr": 126.53
      }
    }
  },
  {
    "player_id": "P009",
    "name": "Tanuja Kanwar",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 13,
        "balls": 26,
        "wickets": 5,
        "impact": 101.89,
        "avg": 1.62,
        "sr": 50.0
      },
      "2": {
        "matches": 8,
        "runs": 46,
        "balls": 44,
        "wickets": 10,
        "impact": 219.63,
        "avg": 5.75,
        "sr": 104.55
      },
      "3": {
        "matches": 9,
        "runs": 55,
        "balls": 54,
        "wickets": 8,
        "impact": 270.0,
        "avg": 6.11,
        "sr": 101.85
      },
      "4": {
        "matches": 8,
        "runs": 54,
        "balls": 36,
        "wickets": 0,
        "impact": 60.0,
        "avg": 6.75,
        "sr": 150.0
      }
    }
  },
  {
    "player_id": "P010",
    "name": "Monica Patel",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 2,
        "runs": 10,
        "balls": 9,
        "wickets": 1,
        "impact": -2.89,
        "avg": 5.0,
        "sr": 111.11
      }
    }
  },
  {
    "player_id": "P011",
    "name": "Mansi Joshi",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 6,
        "runs": 18,
        "balls": 30,
        "wickets": 2,
        "impact": 37.83,
        "avg": 3.0,
        "sr": 60.0
      }
    }
  },
  {
    "player_id": "P012",
    "name": "Hayley Matthews",
    "team": "MIW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 271,
        "balls": 215,
        "wickets": 16,
        "impact": 624.92,
        "avg": 27.1,
        "sr": 126.05
      },
      "2": {
        "matches": 9,
        "runs": 180,
        "balls": 159,
        "wickets": 7,
        "impact": 360.11,
        "avg": 20.0,
        "sr": 113.21
      },
      "3": {
        "matches": 10,
        "runs": 307,
        "balls": 250,
        "wickets": 18,
        "impact": 826.0,
        "avg": 30.7,
        "sr": 122.8
      },
      "4": {
        "matches": 5,
        "runs": 109,
        "balls": 87,
        "wickets": 5,
        "impact": 235.0,
        "avg": 21.8,
        "sr": 125.29
      }
    }
  },
  {
    "player_id": "P013",
    "name": "Yastika Bhatia",
    "team": "MIW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 214,
        "balls": 191,
        "wickets": 0,
        "impact": 270.75,
        "avg": 21.4,
        "sr": 112.04
      },
      "2": {
        "matches": 8,
        "runs": 204,
        "balls": 168,
        "wickets": 0,
        "impact": 225.9,
        "avg": 25.5,
        "sr": 121.43
      },
      "3": {
        "matches": 10,
        "runs": 88,
        "balls": 87,
        "wickets": 0,
        "impact": 103.0,
        "avg": 8.8,
        "sr": 101.15
      }
    }
  },
  {
    "player_id": "P014",
    "name": "Harmanpreet Kaur",
    "team": "MIW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 281,
        "balls": 208,
        "wickets": 0,
        "impact": 437.36,
        "avg": 28.1,
        "sr": 135.1
      },
      "2": {
        "matches": 7,
        "runs": 268,
        "balls": 190,
        "wickets": 0,
        "impact": 286.98,
        "avg": 38.29,
        "sr": 141.05
      },
      "3": {
        "matches": 10,
        "runs": 302,
        "balls": 195,
        "wickets": 0,
        "impact": 400.0,
        "avg": 30.2,
        "sr": 154.87
      },
      "4": {
        "matches": 8,
        "runs": 342,
        "balls": 227,
        "wickets": 0,
        "impact": 420.0,
        "avg": 42.75,
        "sr": 150.66
      }
    }
  },
  {
    "player_id": "P015",
    "name": "Nat Sciver-Brunt",
    "team": "MIW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 332,
        "balls": 237,
        "wickets": 10,
        "impact": 601.84,
        "avg": 33.2,
        "sr": 140.08
      },
      "2": {
        "matches": 9,
        "runs": 172,
        "balls": 144,
        "wickets": 10,
        "impact": 376.64,
        "avg": 19.11,
        "sr": 119.44
      },
      "3": {
        "matches": 10,
        "runs": 523,
        "balls": 343,
        "wickets": 12,
        "impact": 945.0,
        "avg": 52.3,
        "sr": 152.48
      },
      "4": {
        "matches": 7,
        "runs": 321,
        "balls": 212,
        "wickets": 8,
        "impact": 605.0,
        "avg": 45.86,
        "sr": 151.42
      }
    }
  },
  {
    "player_id": "P016",
    "name": "Amelia Kerr",
    "team": "MIW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 149,
        "balls": 112,
        "wickets": 15,
        "impact": 492.05,
        "avg": 14.9,
        "sr": 133.04
      },
      "2": {
        "matches": 9,
        "runs": 215,
        "balls": 166,
        "wickets": 7,
        "impact": 349.94,
        "avg": 23.89,
        "sr": 129.52
      },
      "3": {
        "matches": 10,
        "runs": 73,
        "balls": 88,
        "wickets": 18,
        "impact": 525.0,
        "avg": 7.3,
        "sr": 82.95
      },
      "4": {
        "matches": 7,
        "runs": 74,
        "balls": 61,
        "wickets": 14,
        "impact": 435.0,
        "avg": 10.57,
        "sr": 121.31
      }
    }
  },
  {
    "player_id": "P017",
    "name": "Amanjot Kaur",
    "team": "MIW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 24,
        "balls": 24,
        "wickets": 0,
        "impact": 27.13,
        "avg": 2.4,
        "sr": 100.0
      },
      "2": {
        "matches": 9,
        "runs": 57,
        "balls": 44,
        "wickets": 0,
        "impact": 80.4,
        "avg": 6.33,
        "sr": 129.55
      },
      "3": {
        "matches": 10,
        "runs": 128,
        "balls": 96,
        "wickets": 5,
        "impact": 311.0,
        "avg": 12.8,
        "sr": 133.33
      },
      "4": {
        "matches": 8,
        "runs": 139,
        "balls": 104,
        "wickets": 4,
        "impact": 293.0,
        "avg": 17.38,
        "sr": 133.65
      }
    }
  },
  {
    "player_id": "P018",
    "name": "Pooja Vastrakar",
    "team": "MIW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 7,
        "runs": 71,
        "balls": 49,
        "wickets": 2,
        "impact": 158.2,
        "avg": 10.14,
        "sr": 144.9
      },
      "2": {
        "matches": 9,
        "runs": 55,
        "balls": 59,
        "wickets": 5,
        "impact": 161.9,
        "avg": 6.11,
        "sr": 93.22
      },
      "4": {
        "matches": 2,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P019",
    "name": "Humaira Kazi",
    "team": "MIW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 8,
        "balls": 10,
        "wickets": 0,
        "impact": 11.67,
        "avg": 0.8,
        "sr": 80.0
      },
      "2": {
        "matches": 7,
        "runs": 10,
        "balls": 15,
        "wickets": 0,
        "impact": 2.5,
        "avg": 1.43,
        "sr": 66.67
      }
    }
  },
  {
    "player_id": "P020",
    "name": "Issy Wong",
    "team": "MIW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 61,
        "balls": 46,
        "wickets": 15,
        "impact": 338.33,
        "avg": 6.1,
        "sr": 132.61
      },
      "2": {
        "matches": 2,
        "runs": 15,
        "balls": 6,
        "wickets": 3,
        "impact": 61.0,
        "avg": 7.5,
        "sr": 250.0
      }
    }
  },
  {
    "player_id": "P021",
    "name": "Jintimani Kalita",
    "team": "MIW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 5,
        "balls": 4,
        "wickets": 1,
        "impact": 11.0,
        "avg": 0.5,
        "sr": 125.0
      },
      "3": {
        "matches": 3,
        "runs": 1,
        "balls": 4,
        "wickets": 0,
        "impact": 2.0,
        "avg": 0.33,
        "sr": 25.0
      }
    }
  },
  {
    "player_id": "P022",
    "name": "Saika Ishaque",
    "team": "MIW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 0,
        "balls": 2,
        "wickets": 15,
        "impact": 271.0,
        "avg": 0.0,
        "sr": 0.0
      },
      "2": {
        "matches": 9,
        "runs": 1,
        "balls": 4,
        "wickets": 9,
        "impact": 191.3,
        "avg": 0.11,
        "sr": 25.0
      },
      "3": {
        "matches": 3,
        "runs": 0,
        "balls": 1,
        "wickets": 1,
        "impact": 25.0,
        "avg": 0.0,
        "sr": 0.0
      },
      "4": {
        "matches": 1,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": -10.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P023",
    "name": "Smriti Mandhana",
    "team": "RCBW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 149,
        "balls": 134,
        "wickets": 0,
        "impact": 155.08,
        "avg": 18.62,
        "sr": 111.19
      },
      "2": {
        "matches": 10,
        "runs": 300,
        "balls": 224,
        "wickets": 0,
        "impact": 349.3,
        "avg": 30.0,
        "sr": 133.93
      },
      "3": {
        "matches": 8,
        "runs": 197,
        "balls": 144,
        "wickets": 0,
        "impact": 226.0,
        "avg": 24.62,
        "sr": 136.81
      },
      "4": {
        "matches": 9,
        "runs": 377,
        "balls": 246,
        "wickets": 0,
        "impact": 435.0,
        "avg": 41.89,
        "sr": 153.25
      }
    }
  },
  {
    "player_id": "P024",
    "name": "Sophie Devine",
    "team": "RCBW",
    "role": "Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 266,
        "balls": 154,
        "wickets": 3,
        "impact": 502.74,
        "avg": 33.25,
        "sr": 172.73
      },
      "2": {
        "matches": 10,
        "runs": 136,
        "balls": 108,
        "wickets": 6,
        "impact": 223.7,
        "avg": 13.6,
        "sr": 125.93
      },
      "4": {
        "matches": 9,
        "runs": 243,
        "balls": 164,
        "wickets": 17,
        "impact": 710.0,
        "avg": 27.0,
        "sr": 148.17
      }
    }
  },
  {
    "player_id": "P025",
    "name": "Heather Knight",
    "team": "RCBW",
    "role": "Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 135,
        "balls": 96,
        "wickets": 4,
        "impact": 288.05,
        "avg": 16.88,
        "sr": 140.62
      }
    }
  },
  {
    "player_id": "P026",
    "name": "Disha Kasat",
    "team": "RCBW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 6,
        "runs": 11,
        "balls": 18,
        "wickets": 0,
        "impact": 8.36,
        "avg": 1.83,
        "sr": 61.11
      },
      "2": {
        "matches": 4,
        "runs": 0,
        "balls": 7,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P027",
    "name": "Ellyse Perry",
    "team": "RCBW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 253,
        "balls": 205,
        "wickets": 4,
        "impact": 381.57,
        "avg": 31.62,
        "sr": 123.41
      },
      "2": {
        "matches": 9,
        "runs": 347,
        "balls": 276,
        "wickets": 7,
        "impact": 574.42,
        "avg": 38.56,
        "sr": 125.72
      },
      "3": {
        "matches": 8,
        "runs": 372,
        "balls": 250,
        "wickets": 3,
        "impact": 535.0,
        "avg": 46.5,
        "sr": 148.8
      }
    }
  },
  {
    "player_id": "P028",
    "name": "Richa Ghosh",
    "team": "RCBW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 138,
        "balls": 102,
        "wickets": 0,
        "impact": 213.59,
        "avg": 17.25,
        "sr": 135.29
      },
      "2": {
        "matches": 10,
        "runs": 257,
        "balls": 181,
        "wickets": 0,
        "impact": 289.86,
        "avg": 25.7,
        "sr": 141.99
      },
      "3": {
        "matches": 8,
        "runs": 230,
        "balls": 131,
        "wickets": 0,
        "impact": 300.0,
        "avg": 28.75,
        "sr": 175.57
      },
      "4": {
        "matches": 9,
        "runs": 189,
        "balls": 125,
        "wickets": 0,
        "impact": 245.0,
        "avg": 21.0,
        "sr": 151.2
      }
    }
  },
  {
    "player_id": "P029",
    "name": "Kanika Ahuja",
    "team": "RCBW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 7,
        "runs": 98,
        "balls": 74,
        "wickets": 2,
        "impact": 172.22,
        "avg": 14.0,
        "sr": 132.43
      },
      "3": {
        "matches": 8,
        "runs": 81,
        "balls": 67,
        "wickets": 1,
        "impact": 130.0,
        "avg": 10.12,
        "sr": 120.9
      },
      "4": {
        "matches": 9,
        "runs": 71,
        "balls": 59,
        "wickets": 0,
        "impact": 100.0,
        "avg": 7.89,
        "sr": 120.34
      }
    }
  },
  {
    "player_id": "P030",
    "name": "Asha Shobana",
    "team": "RCBW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 5,
        "runs": 6,
        "balls": 6,
        "wickets": 5,
        "impact": 73.33,
        "avg": 1.2,
        "sr": 100.0
      },
      "2": {
        "matches": 10,
        "runs": 0,
        "balls": 1,
        "wickets": 12,
        "impact": 222.5,
        "avg": 0.0,
        "sr": 0.0
      },
      "4": {
        "matches": 8,
        "runs": 49,
        "balls": 37,
        "wickets": 3,
        "impact": 117.0,
        "avg": 6.12,
        "sr": 132.43
      }
    }
  },
  {
    "player_id": "P031",
    "name": "Preeti Bose",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 6,
        "runs": 3,
        "balls": 9,
        "wickets": 3,
        "impact": 36.9,
        "avg": 0.5,
        "sr": 33.33
      }
    }
  },
  {
    "player_id": "P032",
    "name": "Megan Schutt",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 7,
        "runs": 52,
        "balls": 38,
        "wickets": 4,
        "impact": 126.97,
        "avg": 7.43,
        "sr": 136.84
      }
    }
  },
  {
    "player_id": "P033",
    "name": "Renuka Thakur Singh",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 6,
        "runs": 5,
        "balls": 13,
        "wickets": 1,
        "impact": 10.13,
        "avg": 0.83,
        "sr": 38.46
      },
      "2": {
        "matches": 10,
        "runs": 1,
        "balls": 1,
        "wickets": 2,
        "impact": 42.0,
        "avg": 0.1,
        "sr": 100.0
      },
      "3": {
        "matches": 7,
        "runs": 1,
        "balls": 1,
        "wickets": 10,
        "impact": 261.0,
        "avg": 0.14,
        "sr": 100.0
      },
      "4": {
        "matches": 9,
        "runs": 12,
        "balls": 15,
        "wickets": 7,
        "impact": 199.0,
        "avg": 1.33,
        "sr": 80.0
      }
    }
  },
  {
    "player_id": "P034",
    "name": "Shafali Verma",
    "team": "DCW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 316,
        "balls": 179,
        "wickets": 0,
        "impact": 607.71,
        "avg": 31.6,
        "sr": 176.54
      },
      "2": {
        "matches": 8,
        "runs": 245,
        "balls": 154,
        "wickets": 0,
        "impact": 286.2,
        "avg": 30.62,
        "sr": 159.09
      },
      "3": {
        "matches": 9,
        "runs": 304,
        "balls": 199,
        "wickets": 0,
        "impact": 380.0,
        "avg": 33.78,
        "sr": 152.76
      },
      "4": {
        "matches": 10,
        "runs": 259,
        "balls": 207,
        "wickets": 3,
        "impact": 355.0,
        "avg": 25.9,
        "sr": 125.12
      }
    }
  },
  {
    "player_id": "P035",
    "name": "Meg Lanning",
    "team": "DCW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 396,
        "balls": 291,
        "wickets": 0,
        "impact": 543.26,
        "avg": 39.6,
        "sr": 136.08
      },
      "2": {
        "matches": 8,
        "runs": 280,
        "balls": 226,
        "wickets": 0,
        "impact": 295.5,
        "avg": 35.0,
        "sr": 123.89
      },
      "3": {
        "matches": 9,
        "runs": 276,
        "balls": 232,
        "wickets": 0,
        "impact": 334.0,
        "avg": 30.67,
        "sr": 118.97
      },
      "4": {
        "matches": 8,
        "runs": 248,
        "balls": 198,
        "wickets": 0,
        "impact": 300.0,
        "avg": 31.0,
        "sr": 125.25
      }
    }
  },
  {
    "player_id": "P036",
    "name": "Marizanne Kapp",
    "team": "DCW",
    "role": "Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 177,
        "balls": 146,
        "wickets": 12,
        "impact": 451.53,
        "avg": 17.7,
        "sr": 121.23
      },
      "2": {
        "matches": 6,
        "runs": 79,
        "balls": 59,
        "wickets": 8,
        "impact": 277.28,
        "avg": 13.17,
        "sr": 133.9
      },
      "3": {
        "matches": 8,
        "runs": 106,
        "balls": 82,
        "wickets": 8,
        "impact": 385.0,
        "avg": 13.25,
        "sr": 129.27
      },
      "4": {
        "matches": 10,
        "runs": 49,
        "balls": 45,
        "wickets": 10,
        "impact": 365.0,
        "avg": 4.9,
        "sr": 108.89
      }
    }
  },
  {
    "player_id": "P037",
    "name": "Jemimah Rodrigues",
    "team": "DCW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 130,
        "balls": 99,
        "wickets": 0,
        "impact": 223.61,
        "avg": 13.0,
        "sr": 131.31
      },
      "2": {
        "matches": 8,
        "runs": 231,
        "balls": 152,
        "wickets": 0,
        "impact": 256.9,
        "avg": 28.88,
        "sr": 151.97
      },
      "3": {
        "matches": 9,
        "runs": 146,
        "balls": 112,
        "wickets": 0,
        "impact": 176.0,
        "avg": 16.22,
        "sr": 130.36
      },
      "4": {
        "matches": 10,
        "runs": 264,
        "balls": 186,
        "wickets": 0,
        "impact": 320.0,
        "avg": 26.4,
        "sr": 141.94
      }
    }
  },
  {
    "player_id": "P038",
    "name": "Alice Capsey",
    "team": "DCW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 9,
        "runs": 159,
        "balls": 102,
        "wickets": 6,
        "impact": 359.72,
        "avg": 17.67,
        "sr": 155.88
      },
      "2": {
        "matches": 8,
        "runs": 230,
        "balls": 183,
        "wickets": 4,
        "impact": 337.15,
        "avg": 28.75,
        "sr": 125.68
      },
      "3": {
        "matches": 1,
        "runs": 16,
        "balls": 18,
        "wickets": 1,
        "impact": 37.0,
        "avg": 16.0,
        "sr": 88.89
      }
    }
  },
  {
    "player_id": "P039",
    "name": "Jess Jonassen",
    "team": "DCW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 9,
        "runs": 79,
        "balls": 64,
        "wickets": 9,
        "impact": 281.02,
        "avg": 8.78,
        "sr": 123.44
      },
      "2": {
        "matches": 7,
        "runs": 66,
        "balls": 46,
        "wickets": 11,
        "impact": 291.1,
        "avg": 9.43,
        "sr": 143.48
      },
      "3": {
        "matches": 8,
        "runs": 150,
        "balls": 103,
        "wickets": 13,
        "impact": 507.0,
        "avg": 18.75,
        "sr": 145.63
      }
    }
  },
  {
    "player_id": "P040",
    "name": "Taniya Bhatia",
    "team": "DCW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 5,
        "balls": 15,
        "wickets": 0,
        "impact": -2.97,
        "avg": 0.5,
        "sr": 33.33
      },
      "2": {
        "matches": 8,
        "runs": 0,
        "balls": 2,
        "wickets": 0,
        "impact": 5.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P041",
    "name": "Arundhati Reddy",
    "team": "DCW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 25,
        "balls": 22,
        "wickets": 3,
        "impact": 62.11,
        "avg": 3.12,
        "sr": 113.64
      },
      "2": {
        "matches": 8,
        "runs": 25,
        "balls": 27,
        "wickets": 7,
        "impact": 161.1,
        "avg": 3.12,
        "sr": 92.59
      },
      "3": {
        "matches": 4,
        "runs": 6,
        "balls": 7,
        "wickets": 4,
        "impact": 110.0,
        "avg": 1.5,
        "sr": 85.71
      },
      "4": {
        "matches": 7,
        "runs": 38,
        "balls": 50,
        "wickets": 2,
        "impact": 97.0,
        "avg": 5.43,
        "sr": 76.0
      }
    }
  },
  {
    "player_id": "P042",
    "name": "Shikha Pandey",
    "team": "DCW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 39,
        "balls": 34,
        "wickets": 10,
        "impact": 216.89,
        "avg": 3.9,
        "sr": 114.71
      },
      "2": {
        "matches": 8,
        "runs": 23,
        "balls": 15,
        "wickets": 9,
        "impact": 237.6,
        "avg": 2.88,
        "sr": 153.33
      },
      "3": {
        "matches": 9,
        "runs": 31,
        "balls": 32,
        "wickets": 11,
        "impact": 326.0,
        "avg": 3.44,
        "sr": 96.88
      },
      "4": {
        "matches": 8,
        "runs": 27,
        "balls": 19,
        "wickets": 7,
        "impact": 229.0,
        "avg": 3.38,
        "sr": 142.11
      }
    }
  },
  {
    "player_id": "P043",
    "name": "Radha Yadav",
    "team": "DCW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 38,
        "balls": 24,
        "wickets": 8,
        "impact": 160.94,
        "avg": 3.8,
        "sr": 158.33
      },
      "2": {
        "matches": 8,
        "runs": 27,
        "balls": 21,
        "wickets": 6,
        "impact": 178.0,
        "avg": 3.38,
        "sr": 128.57
      },
      "3": {
        "matches": 2,
        "runs": 9,
        "balls": 6,
        "wickets": 0,
        "impact": 18.0,
        "avg": 4.5,
        "sr": 150.0
      },
      "4": {
        "matches": 9,
        "runs": 114,
        "balls": 81,
        "wickets": 2,
        "impact": 215.0,
        "avg": 12.67,
        "sr": 140.74
      }
    }
  },
  {
    "player_id": "P044",
    "name": "Tara Norris",
    "team": "DCW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 5,
        "runs": 0,
        "balls": 1,
        "wickets": 7,
        "impact": 150.6,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P045",
    "name": "Alyssa Healy",
    "team": "UPW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 266,
        "balls": 194,
        "wickets": 0,
        "impact": 416.42,
        "avg": 26.6,
        "sr": 137.11
      },
      "2": {
        "matches": 7,
        "runs": 162,
        "balls": 134,
        "wickets": 0,
        "impact": 170.09,
        "avg": 23.14,
        "sr": 120.9
      }
    }
  },
  {
    "player_id": "P046",
    "name": "Shweta Sehrawat",
    "team": "UPW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 79,
        "balls": 82,
        "wickets": 0,
        "impact": 89.96,
        "avg": 9.88,
        "sr": 96.34
      },
      "2": {
        "matches": 7,
        "runs": 63,
        "balls": 64,
        "wickets": 0,
        "impact": 59.0,
        "avg": 9.0,
        "sr": 98.44
      },
      "3": {
        "matches": 8,
        "runs": 119,
        "balls": 105,
        "wickets": 0,
        "impact": 125.0,
        "avg": 14.88,
        "sr": 113.33
      },
      "4": {
        "matches": 7,
        "runs": 46,
        "balls": 47,
        "wickets": 0,
        "impact": 50.0,
        "avg": 6.57,
        "sr": 97.87
      }
    }
  },
  {
    "player_id": "P047",
    "name": "Tahlia McGrath",
    "team": "UPW",
    "role": "Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 303,
        "balls": 199,
        "wickets": 2,
        "impact": 494.63,
        "avg": 30.3,
        "sr": 152.26
      },
      "2": {
        "matches": 3,
        "runs": 26,
        "balls": 26,
        "wickets": 1,
        "impact": 39.37,
        "avg": 8.67,
        "sr": 100.0
      },
      "3": {
        "matches": 5,
        "runs": 26,
        "balls": 37,
        "wickets": 2,
        "impact": 79.0,
        "avg": 5.2,
        "sr": 70.27
      }
    }
  },
  {
    "player_id": "P048",
    "name": "Deepti Sharma",
    "team": "UPW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 95,
        "balls": 115,
        "wickets": 6,
        "impact": 175.36,
        "avg": 9.5,
        "sr": 82.61
      },
      "2": {
        "matches": 7,
        "runs": 290,
        "balls": 209,
        "wickets": 10,
        "impact": 566.75,
        "avg": 41.43,
        "sr": 138.76
      },
      "3": {
        "matches": 8,
        "runs": 122,
        "balls": 107,
        "wickets": 8,
        "impact": 356.0,
        "avg": 15.25,
        "sr": 114.02
      },
      "4": {
        "matches": 8,
        "runs": 131,
        "balls": 110,
        "wickets": 7,
        "impact": 312.0,
        "avg": 16.38,
        "sr": 119.09
      }
    }
  },
  {
    "player_id": "P049",
    "name": "Grace Harris",
    "team": "UPW",
    "role": "Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 8,
        "runs": 247,
        "balls": 157,
        "wickets": 1,
        "impact": 385.66,
        "avg": 30.88,
        "sr": 157.32
      },
      "2": {
        "matches": 7,
        "runs": 171,
        "balls": 120,
        "wickets": 4,
        "impact": 321.04,
        "avg": 24.43,
        "sr": 142.5
      },
      "3": {
        "matches": 8,
        "runs": 163,
        "balls": 137,
        "wickets": 8,
        "impact": 399.0,
        "avg": 20.38,
        "sr": 118.98
      },
      "4": {
        "matches": 9,
        "runs": 237,
        "balls": 133,
        "wickets": 2,
        "impact": 347.0,
        "avg": 26.33,
        "sr": 178.2
      }
    }
  },
  {
    "player_id": "P050",
    "name": "Simran Shaikh",
    "team": "UPW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 9,
        "runs": 29,
        "balls": 48,
        "wickets": 0,
        "impact": 26.85,
        "avg": 3.22,
        "sr": 60.42
      },
      "3": {
        "matches": 6,
        "runs": 54,
        "balls": 44,
        "wickets": 0,
        "impact": 71.0,
        "avg": 9.0,
        "sr": 122.73
      },
      "4": {
        "matches": 2,
        "runs": 32,
        "balls": 25,
        "wickets": 0,
        "impact": 35.0,
        "avg": 16.0,
        "sr": 128.0
      }
    }
  },
  {
    "player_id": "P051",
    "name": "Kiran Navgire",
    "team": "UPW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 165,
        "balls": 142,
        "wickets": 0,
        "impact": 196.15,
        "avg": 16.5,
        "sr": 116.2
      },
      "2": {
        "matches": 7,
        "runs": 100,
        "balls": 68,
        "wickets": 0,
        "impact": 124.51,
        "avg": 14.29,
        "sr": 147.06
      },
      "3": {
        "matches": 8,
        "runs": 154,
        "balls": 89,
        "wickets": 0,
        "impact": 200.0,
        "avg": 19.25,
        "sr": 173.03
      },
      "4": {
        "matches": 6,
        "runs": 16,
        "balls": 24,
        "wickets": 0,
        "impact": 20.0,
        "avg": 2.67,
        "sr": 66.67
      }
    }
  },
  {
    "player_id": "P052",
    "name": "Devika Vaidya",
    "team": "UPW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 7,
        "runs": 77,
        "balls": 80,
        "wickets": 1,
        "impact": 103.47,
        "avg": 11.0,
        "sr": 96.25
      }
    }
  },
  {
    "player_id": "P053",
    "name": "Sophie Ecclestone",
    "team": "UPW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 76,
        "balls": 64,
        "wickets": 17,
        "impact": 378.27,
        "avg": 7.6,
        "sr": 118.75
      },
      "2": {
        "matches": 7,
        "runs": 13,
        "balls": 14,
        "wickets": 10,
        "impact": 229.23,
        "avg": 1.86,
        "sr": 92.86
      },
      "3": {
        "matches": 8,
        "runs": 98,
        "balls": 76,
        "wickets": 9,
        "impact": 341.0,
        "avg": 12.25,
        "sr": 128.95
      },
      "4": {
        "matches": 8,
        "runs": 26,
        "balls": 42,
        "wickets": 7,
        "impact": 199.0,
        "avg": 3.25,
        "sr": 61.9
      }
    }
  },
  {
    "player_id": "P054",
    "name": "Anjali Sarvani",
    "team": "UPW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 10,
        "runs": 16,
        "balls": 26,
        "wickets": 4,
        "impact": 53.32,
        "avg": 1.6,
        "sr": 61.54
      },
      "2": {
        "matches": 4,
        "runs": 3,
        "balls": 4,
        "wickets": 2,
        "impact": 6.0,
        "avg": 0.75,
        "sr": 75.0
      },
      "3": {
        "matches": 1,
        "runs": 0,
        "balls": 0,
        "wickets": 1,
        "impact": 25.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P055",
    "name": "Rajeshwari Gayakwad",
    "team": "UPW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 9,
        "runs": 7,
        "balls": 10,
        "wickets": 7,
        "impact": 126.56,
        "avg": 0.78,
        "sr": 70.0
      },
      "2": {
        "matches": 7,
        "runs": 1,
        "balls": 2,
        "wickets": 6,
        "impact": 87.0,
        "avg": 0.14,
        "sr": 50.0
      },
      "3": {
        "matches": 1,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      },
      "4": {
        "matches": 8,
        "runs": 0,
        "balls": 3,
        "wickets": 11,
        "impact": 255.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P056",
    "name": "Sophia Dunkley",
    "team": "GGTW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 6,
        "runs": 121,
        "balls": 69,
        "wickets": 0,
        "impact": 233.85,
        "avg": 20.17,
        "sr": 175.36
      }
    }
  },
  {
    "player_id": "P057",
    "name": "Sushma Verma",
    "team": "GGTW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "1": {
        "matches": 7,
        "runs": 42,
        "balls": 53,
        "wickets": 0,
        "impact": 43.06,
        "avg": 6.0,
        "sr": 79.25
      }
    }
  },
  {
    "player_id": "P058",
    "name": "Kim Garth",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 7,
        "runs": 44,
        "balls": 48,
        "wickets": 11,
        "impact": 261.18,
        "avg": 6.29,
        "sr": 91.67
      },
      "3": {
        "matches": 8,
        "runs": 27,
        "balls": 31,
        "wickets": 8,
        "impact": 232.0,
        "avg": 3.38,
        "sr": 87.1
      }
    }
  },
  {
    "player_id": "P059",
    "name": "Shreyanka Patil",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 7,
        "runs": 62,
        "balls": 41,
        "wickets": 6,
        "impact": 216.75,
        "avg": 8.86,
        "sr": 151.22
      },
      "2": {
        "matches": 8,
        "runs": 19,
        "balls": 14,
        "wickets": 13,
        "impact": 388.0,
        "avg": 2.38,
        "sr": 135.71
      },
      "4": {
        "matches": 9,
        "runs": 28,
        "balls": 17,
        "wickets": 11,
        "impact": 295.0,
        "avg": 3.11,
        "sr": 164.71
      }
    }
  },
  {
    "player_id": "P060",
    "name": "Shabnim Ismail",
    "team": "UPW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 3,
        "runs": 0,
        "balls": 0,
        "wickets": 3,
        "impact": 40.66,
        "avg": 0.0,
        "sr": 0.0
      },
      "2": {
        "matches": 7,
        "runs": 8,
        "balls": 8,
        "wickets": 8,
        "impact": 204.8,
        "avg": 1.14,
        "sr": 100.0
      },
      "3": {
        "matches": 10,
        "runs": 4,
        "balls": 1,
        "wickets": 9,
        "impact": 270.0,
        "avg": 0.4,
        "sr": 400.0
      },
      "4": {
        "matches": 7,
        "runs": 0,
        "balls": 0,
        "wickets": 6,
        "impact": 200.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P061",
    "name": "Poonam Khemnar",
    "team": "RCBW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 2,
        "runs": 12,
        "balls": 13,
        "wickets": 0,
        "impact": 17.11,
        "avg": 6.0,
        "sr": 92.31
      },
      "2": {
        "matches": 7,
        "runs": 89,
        "balls": 81,
        "wickets": 0,
        "impact": 102.2,
        "avg": 12.71,
        "sr": 109.88
      },
      "3": {
        "matches": 1,
        "runs": 0,
        "balls": 0,
        "wickets": 1,
        "impact": 25.0,
        "avg": 0.0,
        "sr": 0.0
      },
      "4": {
        "matches": 7,
        "runs": 2,
        "balls": 4,
        "wickets": 0,
        "impact": 5.0,
        "avg": 0.29,
        "sr": 50.0
      }
    }
  },
  {
    "player_id": "P062",
    "name": "Minnu Mani",
    "team": "DCW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 4,
        "runs": 1,
        "balls": 12,
        "wickets": 0,
        "impact": -2.89,
        "avg": 0.25,
        "sr": 8.33
      },
      "2": {
        "matches": 4,
        "runs": 5,
        "balls": 3,
        "wickets": 3,
        "impact": 89.0,
        "avg": 1.25,
        "sr": 166.67
      },
      "3": {
        "matches": 9,
        "runs": 9,
        "balls": 7,
        "wickets": 6,
        "impact": 183.0,
        "avg": 1.0,
        "sr": 128.57
      },
      "4": {
        "matches": 9,
        "runs": 13,
        "balls": 11,
        "wickets": 6,
        "impact": 140.0,
        "avg": 1.44,
        "sr": 118.18
      }
    }
  },
  {
    "player_id": "P063",
    "name": "Erin Burns",
    "team": "RCBW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 1,
        "runs": 12,
        "balls": 9,
        "wickets": 0,
        "impact": 16.0,
        "avg": 12.0,
        "sr": 133.33
      }
    }
  },
  {
    "player_id": "P064",
    "name": "Komal Zanzad",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 1,
        "runs": 5,
        "balls": 7,
        "wickets": 0,
        "impact": 3.57,
        "avg": 5.0,
        "sr": 71.43
      }
    }
  },
  {
    "player_id": "P065",
    "name": "Sahana Pawar",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 1,
        "runs": 0,
        "balls": 1,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P066",
    "name": "Laura Wolvaardt",
    "team": "GGTW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 4,
        "runs": 143,
        "balls": 102,
        "wickets": 0,
        "impact": 205.02,
        "avg": 35.75,
        "sr": 140.2
      },
      "2": {
        "matches": 6,
        "runs": 167,
        "balls": 129,
        "wickets": 0,
        "impact": 149.6,
        "avg": 27.83,
        "sr": 129.46
      },
      "3": {
        "matches": 3,
        "runs": 32,
        "balls": 41,
        "wickets": 0,
        "impact": 24.0,
        "avg": 10.67,
        "sr": 78.05
      },
      "4": {
        "matches": 10,
        "runs": 317,
        "balls": 234,
        "wickets": 0,
        "impact": 370.0,
        "avg": 31.7,
        "sr": 135.47
      }
    }
  },
  {
    "player_id": "P067",
    "name": "Laura Harris",
    "team": "DCW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 1,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P068",
    "name": "Dhara Gujjar",
    "team": "MIW",
    "role": "Batter",
    "seasonal_stats": {
      "1": {
        "matches": 2,
        "runs": 4,
        "balls": 4,
        "wickets": 0,
        "impact": 4.0,
        "avg": 2.0,
        "sr": 100.0
      }
    }
  },
  {
    "player_id": "P069",
    "name": "Ashwani Kumari",
    "team": "GGTW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 3,
        "runs": 5,
        "balls": 5,
        "wickets": 0,
        "impact": 5.0,
        "avg": 1.67,
        "sr": 100.0
      }
    }
  },
  {
    "player_id": "P071",
    "name": "Poonam Yadav",
    "team": "DCW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 3,
        "runs": 0,
        "balls": 3,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P070",
    "name": "Parshavi Chopra",
    "team": "UPW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "1": {
        "matches": 4,
        "runs": 0,
        "balls": 5,
        "wickets": 3,
        "impact": 26.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P072",
    "name": "S Sajana",
    "team": "MIW",
    "role": "Batter",
    "seasonal_stats": {
      "2": {
        "matches": 9,
        "runs": 87,
        "balls": 55,
        "wickets": 2,
        "impact": 145.7,
        "avg": 9.67,
        "sr": 158.18
      },
      "3": {
        "matches": 10,
        "runs": 51,
        "balls": 40,
        "wickets": 1,
        "impact": 103.5,
        "avg": 5.1,
        "sr": 127.5
      },
      "4": {
        "matches": 8,
        "runs": 103,
        "balls": 76,
        "wickets": 0,
        "impact": 136.0,
        "avg": 12.88,
        "sr": 135.53
      }
    }
  },
  {
    "player_id": "P073",
    "name": "Keerthana Balakrishnan",
    "team": "MIW",
    "role": "Allrounder",
    "seasonal_stats": {
      "2": {
        "matches": 4,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P077",
    "name": "Sophie Molineux",
    "team": "RCBW",
    "role": "Allrounder",
    "seasonal_stats": {
      "2": {
        "matches": 10,
        "runs": 78,
        "balls": 84,
        "wickets": 12,
        "impact": 310.6,
        "avg": 7.8,
        "sr": 92.86
      }
    }
  },
  {
    "player_id": "P075",
    "name": "Simran Bahadur",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "2": {
        "matches": 6,
        "runs": 3,
        "balls": 4,
        "wickets": 0,
        "impact": 6.0,
        "avg": 0.5,
        "sr": 75.0
      }
    }
  },
  {
    "player_id": "P074",
    "name": "Vrinda Dinesh",
    "team": "UPW",
    "role": "Batter",
    "seasonal_stats": {
      "2": {
        "matches": 1,
        "runs": 18,
        "balls": 28,
        "wickets": 0,
        "impact": 19.43,
        "avg": 18.0,
        "sr": 64.29
      },
      "1": {
        "matches": 1,
        "runs": 0,
        "balls": 5,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      },
      "3": {
        "matches": 7,
        "runs": 84,
        "balls": 85,
        "wickets": 0,
        "impact": 87.0,
        "avg": 12.0,
        "sr": 98.82
      }
    }
  },
  {
    "player_id": "P076",
    "name": "Saima Thakor",
    "team": "UPW",
    "role": "Bowler",
    "seasonal_stats": {
      "2": {
        "matches": 6,
        "runs": 5,
        "balls": 8,
        "wickets": 3,
        "impact": 81.3,
        "avg": 0.83,
        "sr": 62.5
      },
      "3": {
        "matches": 4,
        "runs": 33,
        "balls": 19,
        "wickets": 0,
        "impact": 43.0,
        "avg": 8.25,
        "sr": 173.68
      }
    }
  },
  {
    "player_id": "P086",
    "name": "Veda Krishnamurthy",
    "team": "GGTW",
    "role": "Batter",
    "seasonal_stats": {
      "2": {
        "matches": 4,
        "runs": 22,
        "balls": 32,
        "wickets": 0,
        "impact": 12.2,
        "avg": 5.5,
        "sr": 68.75
      }
    }
  },
  {
    "player_id": "P078",
    "name": "Phoebe Litchfield",
    "team": "GGTW",
    "role": "Batter",
    "seasonal_stats": {
      "2": {
        "matches": 8,
        "runs": 108,
        "balls": 107,
        "wickets": 0,
        "impact": 105.83,
        "avg": 13.5,
        "sr": 100.93
      },
      "3": {
        "matches": 6,
        "runs": 91,
        "balls": 67,
        "wickets": 0,
        "impact": 125.0,
        "avg": 15.17,
        "sr": 135.82
      },
      "4": {
        "matches": 6,
        "runs": 243,
        "balls": 157,
        "wickets": 0,
        "impact": 320.0,
        "avg": 40.5,
        "sr": 154.78
      }
    }
  },
  {
    "player_id": "P079",
    "name": "Kathryn Bryce",
    "team": "GGTW",
    "role": "Allrounder",
    "seasonal_stats": {
      "2": {
        "matches": 8,
        "runs": 83,
        "balls": 85,
        "wickets": 4,
        "impact": 183.06,
        "avg": 10.38,
        "sr": 97.65
      }
    }
  },
  {
    "player_id": "P080",
    "name": "Lea Tahuhu",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "2": {
        "matches": 2,
        "runs": 0,
        "balls": 2,
        "wickets": 1,
        "impact": 18.66,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P081",
    "name": "Meghna Singh",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "2": {
        "matches": 7,
        "runs": 14,
        "balls": 12,
        "wickets": 5,
        "impact": 108.0,
        "avg": 2.0,
        "sr": 116.67
      },
      "3": {
        "matches": 6,
        "runs": 6,
        "balls": 7,
        "wickets": 4,
        "impact": 97.0,
        "avg": 1.0,
        "sr": 85.71
      }
    }
  },
  {
    "player_id": "P082",
    "name": "Gouher Sultana",
    "team": "UPW",
    "role": "Bowler",
    "seasonal_stats": {
      "1": {
        "matches": 1,
        "runs": 2,
        "balls": 5,
        "wickets": 0,
        "impact": 6.0,
        "avg": 2.0,
        "sr": 40.0
      },
      "2": {
        "matches": 2,
        "runs": 1,
        "balls": 1,
        "wickets": 0,
        "impact": 5.0,
        "avg": 0.5,
        "sr": 100.0
      },
      "3": {
        "matches": 2,
        "runs": 0,
        "balls": 1,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P083",
    "name": "Nadine de Klerk",
    "team": "RCBW",
    "role": "Allrounder",
    "seasonal_stats": {
      "2": {
        "matches": 1,
        "runs": 1,
        "balls": 2,
        "wickets": 2,
        "impact": 30.0,
        "avg": 1.0,
        "sr": 50.0
      },
      "4": {
        "matches": 9,
        "runs": 133,
        "balls": 96,
        "wickets": 16,
        "impact": 579.0,
        "avg": 14.78,
        "sr": 138.54
      }
    }
  },
  {
    "player_id": "P084",
    "name": "Chamari Athapaththu",
    "team": "UPW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "2": {
        "matches": 4,
        "runs": 28,
        "balls": 27,
        "wickets": 3,
        "impact": 107.7,
        "avg": 7.0,
        "sr": 103.7
      }
    }
  },
  {
    "player_id": "P085",
    "name": "Mannat Kashyap",
    "team": "GGTW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "2": {
        "matches": 4,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": 5.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P088",
    "name": "Titas Sadhu",
    "team": "DCW",
    "role": "Bowler",
    "seasonal_stats": {
      "2": {
        "matches": 4,
        "runs": 0,
        "balls": 1,
        "wickets": 2,
        "impact": 40.0,
        "avg": 0.0,
        "sr": 0.0
      },
      "3": {
        "matches": 3,
        "runs": 0,
        "balls": 0,
        "wickets": 1,
        "impact": 35.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P087",
    "name": "Tarannum Pathan",
    "team": "GGTW",
    "role": "Bowling Allrounder",
    "seasonal_stats": {
      "2": {
        "matches": 1,
        "runs": 9,
        "balls": 11,
        "wickets": 0,
        "impact": 4.0,
        "avg": 9.0,
        "sr": 81.82
      }
    }
  },
  {
    "player_id": "P089",
    "name": "Sayali Satghare",
    "team": "GGTW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "2": {
        "matches": 1,
        "runs": 7,
        "balls": 7,
        "wickets": 0,
        "impact": 10.6,
        "avg": 7.0,
        "sr": 100.0
      },
      "3": {
        "matches": 3,
        "runs": 13,
        "balls": 11,
        "wickets": 1,
        "impact": 43.0,
        "avg": 4.33,
        "sr": 118.18
      },
      "4": {
        "matches": 6,
        "runs": 3,
        "balls": 6,
        "wickets": 9,
        "impact": 220.0,
        "avg": 0.5,
        "sr": 50.0
      }
    }
  },
  {
    "player_id": "P090",
    "name": "Ekta Bisht",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "2": {
        "matches": 2,
        "runs": 12,
        "balls": 5,
        "wickets": 0,
        "impact": 18.5,
        "avg": 6.0,
        "sr": 240.0
      },
      "3": {
        "matches": 4,
        "runs": 2,
        "balls": 1,
        "wickets": 3,
        "impact": 80.0,
        "avg": 0.5,
        "sr": 200.0
      }
    }
  },
  {
    "player_id": "P091",
    "name": "Shabnam Md Shakil",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "2": {
        "matches": 4,
        "runs": 1,
        "balls": 2,
        "wickets": 4,
        "impact": 96.5,
        "avg": 0.25,
        "sr": 50.0
      }
    }
  },
  {
    "player_id": "P092",
    "name": "Uma Chetry",
    "team": "UPW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "2": {
        "matches": 1,
        "runs": 8,
        "balls": 10,
        "wickets": 0,
        "impact": 6.0,
        "avg": 8.0,
        "sr": 80.0
      },
      "3": {
        "matches": 8,
        "runs": 72,
        "balls": 92,
        "wickets": 0,
        "impact": 73.0,
        "avg": 9.0,
        "sr": 78.26
      }
    }
  },
  {
    "player_id": "P093",
    "name": "Bharati Fulmali",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "2": {
        "matches": 3,
        "runs": 64,
        "balls": 53,
        "wickets": 0,
        "impact": 76.8,
        "avg": 21.33,
        "sr": 120.75
      },
      "3": {
        "matches": 6,
        "runs": 133,
        "balls": 77,
        "wickets": 0,
        "impact": 182.0,
        "avg": 22.17,
        "sr": 172.73
      },
      "4": {
        "matches": 9,
        "runs": 119,
        "balls": 81,
        "wickets": 0,
        "impact": 160.0,
        "avg": 13.22,
        "sr": 146.91
      }
    }
  },
  {
    "player_id": "P135",
    "name": "Shraddha Pokharkar",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "2": {
        "matches": 3,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P136",
    "name": "Priyanka Bala",
    "team": "MIW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "2": {
        "matches": 1,
        "runs": 19,
        "balls": 18,
        "wickets": 0,
        "impact": 16.1,
        "avg": 19.0,
        "sr": 105.56
      }
    }
  },
  {
    "player_id": "P116",
    "name": "Deandra Dottin",
    "team": "GGTW",
    "role": "Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 8,
        "runs": 142,
        "balls": 92,
        "wickets": 9,
        "impact": 408.0,
        "avg": 17.75,
        "sr": 154.35
      },
      "4": {
        "matches": 3,
        "runs": 57,
        "balls": 55,
        "wickets": 2,
        "impact": 115.0,
        "avg": 19.0,
        "sr": 103.64
      }
    }
  },
  {
    "player_id": "P099",
    "name": "Priya Mishra",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "3": {
        "matches": 9,
        "runs": 4,
        "balls": 14,
        "wickets": 6,
        "impact": 165.0,
        "avg": 0.44,
        "sr": 28.57
      }
    }
  },
  {
    "player_id": "P098",
    "name": "Kashvee Gautam",
    "team": "GGTW",
    "role": "Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 9,
        "runs": 43,
        "balls": 39,
        "wickets": 11,
        "impact": 330.0,
        "avg": 4.78,
        "sr": 110.26
      },
      "4": {
        "matches": 9,
        "runs": 67,
        "balls": 51,
        "wickets": 8,
        "impact": 290.0,
        "avg": 7.44,
        "sr": 131.37
      }
    }
  },
  {
    "player_id": "P094",
    "name": "Danielle Wyatt-Hodge",
    "team": "RCBW",
    "role": "Batter",
    "seasonal_stats": {
      "3": {
        "matches": 6,
        "runs": 137,
        "balls": 109,
        "wickets": 0,
        "impact": 159.0,
        "avg": 22.83,
        "sr": 125.69
      },
      "4": {
        "matches": 1,
        "runs": 14,
        "balls": 8,
        "wickets": 0,
        "impact": 20.0,
        "avg": 14.0,
        "sr": 175.0
      }
    }
  },
  {
    "player_id": "P095",
    "name": "Raghvi Bist",
    "team": "RCBW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 7,
        "runs": 95,
        "balls": 93,
        "wickets": 0,
        "impact": 96.0,
        "avg": 13.57,
        "sr": 102.15
      }
    }
  },
  {
    "player_id": "P096",
    "name": "Prema Rawat",
    "team": "RCBW",
    "role": "Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 3,
        "runs": 0,
        "balls": 0,
        "wickets": 1,
        "impact": 25.0,
        "avg": 0.0,
        "sr": 0.0
      },
      "4": {
        "matches": 3,
        "runs": 8,
        "balls": 4,
        "wickets": 2,
        "impact": 80.0,
        "avg": 2.67,
        "sr": 200.0
      }
    }
  },
  {
    "player_id": "P097",
    "name": "Joshitha V J",
    "team": "RCBW",
    "role": "Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 4,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P102",
    "name": "Sanskriti Gupta",
    "team": "MIW",
    "role": "Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 10,
        "runs": 23,
        "balls": 18,
        "wickets": 4,
        "impact": 151.0,
        "avg": 2.3,
        "sr": 127.78
      },
      "4": {
        "matches": 8,
        "runs": 10,
        "balls": 6,
        "wickets": 1,
        "impact": 60.0,
        "avg": 1.25,
        "sr": 166.67
      }
    }
  },
  {
    "player_id": "P100",
    "name": "Niki Prasad",
    "team": "DCW",
    "role": "Batting Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 8,
        "runs": 78,
        "balls": 66,
        "wickets": 0,
        "impact": 90.0,
        "avg": 9.75,
        "sr": 118.18
      },
      "4": {
        "matches": 10,
        "runs": 75,
        "balls": 62,
        "wickets": 0,
        "impact": 70.0,
        "avg": 7.5,
        "sr": 120.97
      }
    }
  },
  {
    "player_id": "P101",
    "name": "Sarah Bryce",
    "team": "DCW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "3": {
        "matches": 9,
        "runs": 60,
        "balls": 40,
        "wickets": 0,
        "impact": 80.0,
        "avg": 6.67,
        "sr": 150.0
      }
    }
  },
  {
    "player_id": "P103",
    "name": "Alana King",
    "team": "UPW",
    "role": "Bowler",
    "seasonal_stats": {
      "3": {
        "matches": 1,
        "runs": 19,
        "balls": 14,
        "wickets": 0,
        "impact": 18.0,
        "avg": 19.0,
        "sr": 135.71
      }
    }
  },
  {
    "player_id": "P104",
    "name": "Kranti Goud",
    "team": "UPW",
    "role": "Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 8,
        "runs": 8,
        "balls": 7,
        "wickets": 2,
        "impact": 67.0,
        "avg": 1.0,
        "sr": 114.29
      },
      "4": {
        "matches": 8,
        "runs": 1,
        "balls": 2,
        "wickets": 3,
        "impact": 80.0,
        "avg": 0.12,
        "sr": 50.0
      }
    }
  },
  {
    "player_id": "P105",
    "name": "G Kamalini",
    "team": "MIW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "3": {
        "matches": 9,
        "runs": 32,
        "balls": 25,
        "wickets": 0,
        "impact": 49.0,
        "avg": 3.56,
        "sr": 128.0
      },
      "4": {
        "matches": 2,
        "runs": 48,
        "balls": 47,
        "wickets": 0,
        "impact": 50.0,
        "avg": 24.0,
        "sr": 102.13
      }
    }
  },
  {
    "player_id": "P106",
    "name": "Parunika Sisodia",
    "team": "MIW",
    "role": "Bowler",
    "seasonal_stats": {
      "3": {
        "matches": 5,
        "runs": 0,
        "balls": 1,
        "wickets": 1,
        "impact": 25.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P107",
    "name": "Chinelle Henry",
    "team": "UPW",
    "role": "Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 7,
        "runs": 163,
        "balls": 83,
        "wickets": 6,
        "impact": 363.0,
        "avg": 23.29,
        "sr": 196.39
      },
      "4": {
        "matches": 8,
        "runs": 108,
        "balls": 69,
        "wickets": 14,
        "impact": 445.0,
        "avg": 13.5,
        "sr": 156.52
      }
    }
  },
  {
    "player_id": "P108",
    "name": "Nallapureddy Charani",
    "team": "DCW",
    "role": "Bowler",
    "seasonal_stats": {
      "3": {
        "matches": 2,
        "runs": 3,
        "balls": 4,
        "wickets": 4,
        "impact": 103.0,
        "avg": 1.5,
        "sr": 75.0
      }
    }
  },
  {
    "player_id": "P109",
    "name": "Georgia Voll",
    "team": "UPW",
    "role": "Batter",
    "seasonal_stats": {
      "3": {
        "matches": 3,
        "runs": 154,
        "balls": 92,
        "wickets": 0,
        "impact": 190.0,
        "avg": 51.33,
        "sr": 167.39
      },
      "4": {
        "matches": 6,
        "runs": 170,
        "balls": 134,
        "wickets": 0,
        "impact": 201.0,
        "avg": 28.33,
        "sr": 126.87
      }
    }
  },
  {
    "player_id": "P110",
    "name": "Charlotte Dean",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "3": {
        "matches": 1,
        "runs": 9,
        "balls": 5,
        "wickets": 1,
        "impact": 40.0,
        "avg": 9.0,
        "sr": 180.0
      }
    }
  },
  {
    "player_id": "P111",
    "name": "Heather Graham",
    "team": "RCBW",
    "role": "Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 1,
        "runs": 0,
        "balls": 0,
        "wickets": 1,
        "impact": 25.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P137",
    "name": "Danielle Gibson",
    "team": "GGTW",
    "role": "Allrounder",
    "seasonal_stats": {
      "3": {
        "matches": 1,
        "runs": 34,
        "balls": 24,
        "wickets": 2,
        "impact": 95.0,
        "avg": 34.0,
        "sr": 141.67
      }
    }
  },
  {
    "player_id": "P112",
    "name": "Nicola Carey",
    "team": "MIW",
    "role": "Allrounder",
    "seasonal_stats": {
      "4": {
        "matches": 6,
        "runs": 149,
        "balls": 105,
        "wickets": 7,
        "impact": 380.0,
        "avg": 24.83,
        "sr": 141.9
      }
    }
  },
  {
    "player_id": "P114",
    "name": "Linsey Smith",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "4": {
        "matches": 3,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": -10.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P113",
    "name": "Lauren Bell",
    "team": "RCBW",
    "role": "Bowler",
    "seasonal_stats": {
      "4": {
        "matches": 9,
        "runs": 1,
        "balls": 1,
        "wickets": 12,
        "impact": 350.0,
        "avg": 0.11,
        "sr": 100.0
      }
    }
  },
  {
    "player_id": "P115",
    "name": "Anushka Sharma",
    "team": "GGTW",
    "role": "Allrounder",
    "seasonal_stats": {
      "4": {
        "matches": 7,
        "runs": 177,
        "balls": 137,
        "wickets": 0,
        "impact": 210.0,
        "avg": 25.29,
        "sr": 129.2
      }
    }
  },
  {
    "player_id": "P120",
    "name": "Triveni Vasistha",
    "team": "MIW",
    "role": "Allrounder",
    "seasonal_stats": {
      "4": {
        "matches": 4,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": -15.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P117",
    "name": "Lizelle Lee",
    "team": "DCW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "4": {
        "matches": 10,
        "runs": 320,
        "balls": 230,
        "wickets": 0,
        "impact": 400.0,
        "avg": 32.0,
        "sr": 139.13
      }
    }
  },
  {
    "player_id": "P118",
    "name": "Shree Charani",
    "team": "DCW",
    "role": "Bowler",
    "seasonal_stats": {
      "4": {
        "matches": 10,
        "runs": 21,
        "balls": 17,
        "wickets": 14,
        "impact": 351.0,
        "avg": 2.1,
        "sr": 123.53
      }
    }
  },
  {
    "player_id": "P119",
    "name": "Nandani Sharma",
    "team": "DCW",
    "role": "Bowler",
    "seasonal_stats": {
      "4": {
        "matches": 10,
        "runs": 1,
        "balls": 4,
        "wickets": 17,
        "impact": 401.0,
        "avg": 0.1,
        "sr": 25.0
      }
    }
  },
  {
    "player_id": "P121",
    "name": "Gautami Naik",
    "team": "RCBW",
    "role": "Allrounder",
    "seasonal_stats": {
      "4": {
        "matches": 6,
        "runs": 86,
        "balls": 70,
        "wickets": 0,
        "impact": 110.0,
        "avg": 14.33,
        "sr": 122.86
      }
    }
  },
  {
    "player_id": "P123",
    "name": "Ayushi Soni",
    "team": "GGTW",
    "role": "Allrounder",
    "seasonal_stats": {
      "4": {
        "matches": 1,
        "runs": 11,
        "balls": 14,
        "wickets": 0,
        "impact": 10.0,
        "avg": 11.0,
        "sr": 78.57
      }
    }
  },
  {
    "player_id": "P122",
    "name": "Gunalan Kamalini",
    "team": "MIW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "4": {
        "matches": 4,
        "runs": 27,
        "balls": 30,
        "wickets": 0,
        "impact": 45.0,
        "avg": 6.75,
        "sr": 90.0
      }
    }
  },
  {
    "player_id": "P124",
    "name": "Chloe Tryon",
    "team": "UPW",
    "role": "Allrounder",
    "seasonal_stats": {
      "4": {
        "matches": 5,
        "runs": 85,
        "balls": 56,
        "wickets": 2,
        "impact": 151.0,
        "avg": 17.0,
        "sr": 151.79
      }
    }
  },
  {
    "player_id": "P125",
    "name": "Shivani Singh",
    "team": "GGTW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "4": {
        "matches": 1,
        "runs": 0,
        "balls": 2,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P126",
    "name": "Nalla Kranthi Reddy",
    "team": "MIW",
    "role": "Bowler",
    "seasonal_stats": {
      "4": {
        "matches": 1,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P127",
    "name": "Lucy Hamilton",
    "team": "DCW",
    "role": "Allrounder",
    "seasonal_stats": {
      "4": {
        "matches": 2,
        "runs": 36,
        "balls": 19,
        "wickets": 0,
        "impact": 40.0,
        "avg": 18.0,
        "sr": 189.47
      }
    }
  },
  {
    "player_id": "P128",
    "name": "Happy Kumari",
    "team": "GGTW",
    "role": "Bowler",
    "seasonal_stats": {
      "4": {
        "matches": 2,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": -5.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P129",
    "name": "Rahila Firdous",
    "team": "MIW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "4": {
        "matches": 2,
        "runs": 1,
        "balls": 1,
        "wickets": 0,
        "impact": 5.0,
        "avg": 0.5,
        "sr": 100.0
      }
    }
  },
  {
    "player_id": "P131",
    "name": "Vaishnavi Sharma",
    "team": "MIW",
    "role": "Allrounder",
    "seasonal_stats": {
      "4": {
        "matches": 3,
        "runs": 0,
        "balls": 0,
        "wickets": 1,
        "impact": 35.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P130",
    "name": "Deeya Yadav",
    "team": "DCW",
    "role": "Batter",
    "seasonal_stats": {
      "4": {
        "matches": 1,
        "runs": 0,
        "balls": 0,
        "wickets": 0,
        "impact": 0.0,
        "avg": 0.0,
        "sr": 0.0
      }
    }
  },
  {
    "player_id": "P132",
    "name": "Amy Jones",
    "team": "UPW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "4": {
        "matches": 1,
        "runs": 1,
        "balls": 2,
        "wickets": 0,
        "impact": 0.0,
        "avg": 1.0,
        "sr": 50.0
      }
    }
  },
  {
    "player_id": "P134",
    "name": "Charli Knott",
    "team": "UPW",
    "role": "Allrounder",
    "seasonal_stats": {
      "4": {
        "matches": 1,
        "runs": 12,
        "balls": 12,
        "wickets": 0,
        "impact": 15.0,
        "avg": 12.0,
        "sr": 100.0
      }
    }
  },
  {
    "player_id": "P133",
    "name": "Shipra Giri",
    "team": "UPW",
    "role": "WK-Batter",
    "seasonal_stats": {
      "4": {
        "matches": 1,
        "runs": 9,
        "balls": 8,
        "wickets": 0,
        "impact": 10.0,
        "avg": 9.0,
        "sr": 112.5
      }
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    await Player.deleteMany({});
    console.log('🗑️ Cleared existing players');
    await Player.insertMany(players);
    console.log(`✅ Seeded ${players.length} players`);
    mongoose.disconnect();
    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();