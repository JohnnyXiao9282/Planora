from flask import Blueprint, request, jsonify, session
from repo.resume_template_repository import get_all_static

checkout_bp = Blueprint('checkout', __name__)

@checkout_bp.after_request
def add_cors_headers(response):
    origin = request.headers.get('Origin')
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
    else:
        response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

# Simulate a purchase and store in session (in production, use a database)
@checkout_bp.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    selected_ids = data.get('selectedIds', [])
    templates = get_all_static()
    selected_templates = [t for t in templates if t['template_id'] in selected_ids]
    if not selected_templates:
        return jsonify({'error': 'No valid templates selected'}), 400
    # Store purchase history in session for demo
    history = session.get('purchase_history', [])
    history.append({
        'templates': selected_templates,
        'total': sum(t['price'] for t in selected_templates)
    })
    session['purchase_history'] = history
    # Optionally clear cart
    session['cart'] = [t for t in session.get('cart', []) if t['template_id'] not in selected_ids]
    return jsonify({'success': True, 'purchased': selected_templates, 'total': sum(t['price'] for t in selected_templates)})

@checkout_bp.route('/purchase-history', methods=['GET'])
def purchase_history():
    history = session.get('purchase_history', [])
    return jsonify(history)
