import uuid

from flask import Blueprint, jsonify, request, session

from agent.profile_import import MAX_IMPORT_CHARS, parse_profile_text
from repo.profile_repository import get_profile, save_profile

profile_bp = Blueprint('profile', __name__)


def get_uid(create=False):
    """Anonymous per-browser id stored in the session cookie."""
    uid = session.get('uid')
    if not uid and create:
        uid = uuid.uuid4().hex
        session['uid'] = uid
    return uid


@profile_bp.after_request
def add_cors_headers(response):
    origin = request.headers.get('Origin')
    response.headers['Access-Control-Allow-Origin'] = origin or '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@profile_bp.route('/profile', methods=['GET', 'PUT', 'OPTIONS'])
def profile():
    if request.method == 'OPTIONS':
        return '', 204
    if request.method == 'GET':
        return jsonify(get_profile(get_uid()))
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'error': 'Expected a JSON object'}), 400
    return jsonify(save_profile(get_uid(create=True), data))


@profile_bp.route('/profile/import', methods=['POST', 'OPTIONS'])
def import_profile():
    """Parse pasted text (LinkedIn profile, resume) into profile sections.
    Returns the parsed sections without saving, so the user can review them."""
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json(silent=True) or {}
    text = str(data.get('text') or '').strip()
    if not text:
        return jsonify({'error': 'Paste some text to import'}), 400
    if len(text) > MAX_IMPORT_CHARS:
        text = text[:MAX_IMPORT_CHARS]
    parsed, method = parse_profile_text(text)
    return jsonify({'profile': parsed, 'method': method})
