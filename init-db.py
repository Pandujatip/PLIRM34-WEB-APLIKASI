#!/usr/bin/env python3
"""Initialize PLIRM34 database with schema"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    import server
    
    print("[*] Initializing database...")
    print(f"    Data directory: {server.DATA_DIR}")
    print(f"    Database file: {server.DB_PATH}")
    
    # Initialize private data directory and database
    server.ensure_private_data_directory()
    server.init_db()
    
    print("[OK] Database initialized successfully!")
    print(f"[*] Schema created")
    print(f"[*] Default users created:")
    print(f"    - admin.plirm34 / admin123")
    print(f"    - organik.plirm34 / organik123")
    print(f"    - team.plirm34 / team123")
    
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
