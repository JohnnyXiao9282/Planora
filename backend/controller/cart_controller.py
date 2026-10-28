from flask import Blueprint, jsonify, request, session
import sys
from repo.resume_template_repository import get_all_static


cart_bp = Blueprint('cart', __name__)

# Add CORS headers to all responses from this blueprint
@cart_bp.after_request
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


# Session cookies are limited to ~4KB, so store only template IDs in the
# session and look up the full templates when responding.
def get_cart_ids():
	ids = []
	for item in session.get('cart', []):
		# tolerate old sessions that stored full template dicts
		tid = item.get('template_id') if isinstance(item, dict) else item
		if tid and tid not in ids:
			ids.append(tid)
	return ids


def ids_to_templates(ids):
	by_id = {t['template_id']: t for t in get_all_static()}
	return [by_id[i] for i in ids if i in by_id]


@cart_bp.route('/cart', methods=['GET'])
def get_cart():
	return jsonify(ids_to_templates(get_cart_ids()))

@cart_bp.route('/cart', methods=['POST'])
def add_to_cart():
	data = request.get_json(silent=True) or {}
	template_id = data.get('template_id')
	if not any(t['template_id'] == template_id for t in get_all_static()):
		return jsonify({'error': 'Template not found'}), 404
	ids = get_cart_ids()
	if template_id not in ids:
		ids.append(template_id)
	session['cart'] = ids
	return jsonify({'success': True, 'cart': ids_to_templates(ids)})

# Remove a template from the cart
@cart_bp.route('/cart/remove', methods=['POST'])
def remove_from_cart():
	data = request.get_json(silent=True) or {}
	template_id = data.get('template_id')
	if not template_id:
		return jsonify({'error': 'No template_id provided'}), 400
	ids = [i for i in get_cart_ids() if i != template_id]
	session['cart'] = ids
	return jsonify({'success': True, 'cart': ids_to_templates(ids)})