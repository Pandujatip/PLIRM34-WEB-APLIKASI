# PLIRM34 Backend Optimization Patch - Phase 1
# Add to server.py to enable pagination, caching, and compression

# PATCH 1: Add imports at the top of server.py
# Add these to the import section:

from functools import wraps
import gzip
import io

# PATCH 2: Add pagination helper functions

def paginate_query_string(limit=50, max_limit=500):
    """Parse pagination parameters from query string"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', limit))
        
        # Security: limit max items per page
        if limit > max_limit:
            limit = max_limit
        if limit < 1:
            limit = 1
        if page < 1:
            page = 1
            
        offset = (page - 1) * limit
        return {'page': page, 'limit': limit, 'offset': offset}
    except (ValueError, TypeError):
        return {'page': 1, 'limit': limit, 'offset': 0}


def create_paginated_response(items, total, page, limit):
    """Create standardized pagination response"""
    return {
        'items': items,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total,
            'hasMore': page * limit < total,
            'totalPages': (total + limit - 1) // limit
        }
    }


# PATCH 3: Update get items endpoint (find this in handle_items GET handler)
# BEFORE (old code):
# SELECT * FROM {table} WHERE user_id = ?
# return json.dumps(cursor.fetchall())

# AFTER (new paginated code):
def get_items_paginated(resource_key):
    """GET /api/items/{resource}?page=1&limit=50"""
    resource = RESOURCE_TABLES.get(resource_key)
    if not resource:
        raise ValueError(f"Unknown resource: {resource_key}")
    
    pagination = paginate_query_string(limit=50, max_limit=200)
    table = resource['table']
    columns = resource['columns']
    
    # Get total count
    cursor.execute(f"SELECT COUNT(*) FROM {table} WHERE user_id = ?", (user_id,))
    total = cursor.fetchone()[0]
    
    # Get paginated items
    column_list = ', '.join(columns)
    cursor.execute(
        f"SELECT {column_list} FROM {table} WHERE user_id = ? "
        f"ORDER BY created_at DESC LIMIT ? OFFSET ?",
        (user_id, pagination['limit'], pagination['offset'])
    )
    
    items = cursor.fetchall()
    return create_paginated_response(
        items, total, pagination['page'], pagination['limit']
    )


# PATCH 4: Add cache control headers
def add_cache_headers(response_obj, cache_type='private', max_age=300):
    """Add appropriate Cache-Control headers"""
    if cache_type == 'public':
        response_obj['Cache-Control'] = f'public, max-age={max_age}'
    elif cache_type == 'private':
        response_obj['Cache-Control'] = f'private, max-age={max_age}'
    else:
        response_obj['Cache-Control'] = 'no-store, must-revalidate'
    
    response_obj['X-Content-Type-Options'] = 'nosniff'
    response_obj['X-Frame-Options'] = 'SAMEORIGIN'
    return response_obj


# PATCH 5: Add gzip compression middleware
class GzipMiddleware:
    """Compress responses larger than 1KB"""
    def __init__(self, app):
        self.app = app
    
    def __call__(self, environ, start_response):
        if 'gzip' not in environ.get('HTTP_ACCEPT_ENCODING', ''):
            return self.app(environ, start_response)
        
        captured_data = []
        captured_status = [None]
        captured_headers = [None]
        
        def capture_start_response(status, headers):
            captured_status[0] = status
            captured_headers[0] = headers
            return lambda s: captured_data.append(s)
        
        app_iter = self.app(environ, capture_start_response)
        data = b''.join(app_iter)
        
        # Only compress if >1KB
        if len(data) < 1024:
            start_response(captured_status[0], captured_headers[0])
            return [data]
        
        # Compress data
        gzip_buffer = io.BytesIO()
        with gzip.GzipFile(fileobj=gzip_buffer, mode='wb') as f:
            f.write(data)
        gzip_data = gzip_buffer.getvalue()
        
        # Update headers
        new_headers = [
            (name, value) for name, value in captured_headers[0]
            if name.lower() != 'content-length'
        ]
        new_headers.append(('Content-Encoding', 'gzip'))
        new_headers.append(('Content-Length', str(len(gzip_data))))
        new_headers.append(('Vary', 'Accept-Encoding'))
        
        start_response(captured_status[0], new_headers)
        return [gzip_data]


# PATCH 6: Update API endpoints with caching
# For /api/masters endpoint:
def handle_masters(user_id, cursor):
    """GET /api/masters - cached for 1 hour"""
    response = json.dumps(get_masters_data(cursor))
    headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=3600',  # 1 hour
        'ETag': hashlib.md5(response.encode()).hexdigest(),
    }
    return response, headers


# For /api/bootstrap endpoint:
def handle_bootstrap(user_id, cursor):
    """GET /api/bootstrap - cached for 30 minutes"""
    response = json.dumps(get_bootstrap_data(cursor))
    headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=1800',  # 30 minutes
        'ETag': hashlib.md5(response.encode()).hexdigest(),
    }
    return response, headers


# PATCH 7: Error response structure improvement
def create_error_response(code, message, details=None, status=400):
    """Create structured error response"""
    return {
        'error': code,
        'message': message,
        'details': details or {},
        'timestamp': datetime.now(JAKARTA_TIMEZONE).isoformat()
    }, status


# Example usage:
# if not item:
#     return create_error_response(
#         'item_not_found',
#         'Item tidak ditemukan',
#         {'item_id': item_id},
#         404
#     )


# PATCH 8: Add to server startup
# In your main app initialization:

# Enable GZIP compression
# app.wsgi_app = GzipMiddleware(app.wsgi_app)

# Or if using ThreadingHTTPServer directly, wrap the handler
