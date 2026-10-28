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
    # Store only IDs in the session (cookie size limit ~4KB)
    history = session.get('purchase_history', [])
    history.append({
        'template_ids': [t['template_id'] for t in selected_templates],
        'total': sum(t['price'] for t in selected_templates)
    })
    session['purchase_history'] = history[-20:]
    # Remove purchased items from cart
    session['cart'] = [
        (i.get('template_id') if isinstance(i, dict) else i)
        for i in session.get('cart', [])
        if (i.get('template_id') if isinstance(i, dict) else i) not in selected_ids
    ]
    return jsonify({'success': True, 'purchased': selected_templates, 'total': sum(t['price'] for t in selected_templates)})

@checkout_bp.route('/purchase-history', methods=['GET'])
def purchase_history():
    by_id = {t['template_id']: t for t in get_all_static()}
    result = []
    for entry in session.get('purchase_history', []):
        if 'templates' in entry:  # old format with full templates
            result.append(entry)
            continue
        result.append({
            'templates': [by_id[i] for i in entry.get('template_ids', []) if i in by_id],
            'total': entry.get('total', 0),
        })
    return jsonify(result)
