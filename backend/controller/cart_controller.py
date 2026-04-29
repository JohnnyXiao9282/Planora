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


# Use session-based cart so each user has their own cart
def get_session_cart():
	if 'cart' not in session:
		session['cart'] = []
	return session['cart']

@cart_bp.route('/cart', methods=['GET'])
def get_cart():
	cart = session.get('cart', [])
	return jsonify(cart)

@cart_bp.route('/cart', methods=['POST'])
def add_to_cart():
	data = request.get_json()
	template_id = data.get('template_id')
	templates = get_all_static()
	template = next((t for t in templates if t['template_id'] == template_id), None)
	if not template:
		return jsonify({'error': 'Template not found'}), 404
	cart = get_session_cart()
	if not any(t['template_id'] == template_id for t in cart):
		cart.append(template)
		session['cart'] = cart
	return jsonify({'success': True, 'cart': cart})

# Remove a template from the cart
@cart_bp.route('/cart/remove', methods=['POST'])
def remove_from_cart():
	data = request.get_json()
	template_id = data.get('template_id')
	if not template_id:
		return jsonify({'error': 'No template_id provided'}), 400
	cart = get_session_cart()
	new_cart = [t for t in cart if t['template_id'] != template_id]
	session['cart'] = new_cart
	return jsonify({'success': True, 'cart': new_cart})