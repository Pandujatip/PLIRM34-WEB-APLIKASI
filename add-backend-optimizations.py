#!/usr/bin/env python3
"""
Phase 1 Task 2: Backend API Optimization
Adds pagination, caching, and performance headers to server.py
"""

import re
from pathlib import Path

def add_pagination_helpers(server_py_content):
    """Add pagination helper functions after imports"""
    
    pagination_code = '''

def parse_pagination_params(query_str="", default_limit=50, max_limit=500):
    """Parse pagination parameters from query string"""
    params = {}
    if not query_str:
        return {'page': 1, 'limit': default_limit, 'offset': 0}
    
    try:
        parts = query_str.split('&')
        for part in parts:
            if '=' in part:
                key, val = part.split('=', 1)
                params[key] = val
    except:
        pass
    
    try:
        page = max(1, int(params.get('page', 1)))
    except (ValueError, TypeError):
        page = 1
    
    try:
        limit = int(params.get('limit', default_limit))
        limit = max(1, min(limit, max_limit))
    except (ValueError, TypeError):
        limit = default_limit
    
    offset = (page - 1) * limit
    return {'page': page, 'limit': limit, 'offset': offset}


def create_paginated_response(items, total, page, limit):
    """Create standardized pagination response"""
    total_pages = (total + limit - 1) // limit if limit > 0 else 1
    return {
        'data': items,
        'meta': {
            'page': page,
            'limit': limit,
            'total': total,
            'pages': total_pages,
            'hasMore': page * limit < total
        }
    }
'''
    
    # Find a good place to insert - after the init_db function definition
    init_db_end = server_py_content.find('\ndef ')
    if init_db_end == -1:
        # Fallback: find the class definition
        class_def = server_py_content.find('class ')
        if class_def != -1:
            return server_py_content[:class_def] + pagination_code + server_py_content[class_def:]
    else:
        return server_py_content[:init_db_end] + pagination_code + server_py_content[init_db_end:]
    
    return server_py_content + pagination_code


def add_cache_headers_to_responses(server_py_content):
    """Add cache headers to common endpoints"""
    
    # Add cache control after the _send_json method
    cache_methods = '''

def _send_json_cached(self, data, max_age=300, status=HTTPStatus.OK, public=False):
    """Send JSON response with appropriate cache headers"""
    cache_control = f"{'public' if public else 'private'}, max-age={max_age}"
    self._send_json(data, status=status, headers={
        'Cache-Control': cache_control,
        'ETag': hashlib.md5(json.dumps(data, sort_keys=True, default=str).encode()).hexdigest(),
        'Vary': 'Accept-Encoding'
    })
'''
    
    return server_py_content + cache_methods


def main():
    server_path = Path(__file__).parent / "server.py"
    
    if not server_path.exists():
        print(f"[ERROR] server.py not found at {server_path}")
        return False
    
    print(f"[*] Reading server.py ({server_path})...")
    with open(server_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"[*] Adding pagination helpers...")
    content = add_pagination_helpers(content)
    
    print(f"[*] Adding cache header methods...")
    content = add_cache_headers_to_responses(content)
    
    # Verify content was modified
    if 'parse_pagination_params' not in content:
        print("[ERROR] Failed to add pagination helpers")
        return False
    
    if '_send_json_cached' not in content:
        print("[ERROR] Failed to add cache methods")
        return False
    
    # Create backup
    backup_path = server_path.with_name('server.py.backup-phase1')
    print(f"[*] Creating backup at {backup_path}...")
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Write modified content
    print(f"[*] Writing optimized server.py...")
    with open(server_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print()
    print("[OK] Backend optimization helpers added!")
    print()
    print("[*] Next steps:")
    print("    1. Update _handle_items_get() to use parse_pagination_params()")
    print("    2. Update _handle_items_get() to use create_paginated_response()")
    print("    3. Update _send_json() calls to use _send_json_cached() where appropriate")
    print("    4. Add cache headers to:")
    print("       - /api/bootstrap (3600s cache)")
    print("       - /api/masters (3600s cache)")
    print("       - /api/carbon-brush-stock (600s cache)")
    print("       - /api/items/* (300s cache for GET)")
    print()
    print("[MANUAL STEPS REQUIRED]:")
    print("    - Update /api/items/{resource} GET handler (line ~6552)")
    print("    - Change to: paginate_response = create_paginated_response(...)")
    print("    - Test endpoints with: curl 'http://localhost:5000/api/items/sparepart?page=1&limit=10'")
    
    return True


if __name__ == "__main__":
    if main():
        print("\n[SUCCESS] Backend optimization helpers installed")
        exit(0)
    else:
        print("\n[FAILED] Could not add optimization helpers")
        exit(1)
