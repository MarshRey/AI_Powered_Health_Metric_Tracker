import sqlite3

DB_FILE = 'health_metrics.db'

def init_db():
    """Initialize the database and create the necessary tables."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS health_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            steps INTEGER,
            sleep_hours FLOAT,
            heart_rate INTEGER,
            date TEXT
        )
    ''')

    conn.commit()
    conn.close()
    
def insert_metric(steps, sleep_hours, heart_rate, date):
    """Insert a new health metric record into the database."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO health_metrics (steps, sleep_hours, heart_rate, date)
        VALUES (?, ?, ?, ?)
    ''', (steps, sleep_hours, heart_rate, date))

    conn.commit()
    conn.close()
    
def get_all_metrics():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT steps, sleep_hours, heart_rate, date FROM health_metrics')
    rows = cursor.fetchall()
    conn.close()
    return rows