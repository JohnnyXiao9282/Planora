from flask import Blueprint, jsonify, request

from agent.resume_agent import chat

agent_bp = Blueprint('agent', __name__)


@agent_bp.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
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
    return jsonify({'reply': chat(messages)})
