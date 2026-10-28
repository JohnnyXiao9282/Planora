from flask import Blueprint, jsonify, request

from agent.resume_agent import chat
from controller.profile_controller import get_uid
from repo.profile_repository import get_profile

agent_bp = Blueprint('agent', __name__)


@agent_bp.after_request
def add_cors_headers(response):
    # Echo the origin (not '*') so the browser can send the session cookie
    origin = request.headers.get('Origin')
    response.headers['Access-Control-Allow-Origin'] = origin or '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@agent_bp.route('/agent/chat', methods=['POST', 'OPTIONS'])
def agent_chat():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.get_json(silent=True) or {}
    messages = data.get('messages', [])
    if not isinstance(messages, list):
        return jsonify({'error': 'messages must be a list'}), 400
    profile = get_profile(get_uid())
    return jsonify({'reply': chat(messages, profile)})
