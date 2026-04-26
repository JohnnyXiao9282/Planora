from flask import Blueprint, jsonify, request, make_response
from repo.resume_template_repository import get_all_static

resume_template_bp = Blueprint('resume_template', __name__)

@resume_template_bp.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response


@resume_template_bp.route('/resume-templates', methods=['GET'])
def list_resume_templates():
    templates = get_all_static()
    if not templates:
        return jsonify([])
    return jsonify(templates)

@resume_template_bp.route('/resume-templates/<template_id>', methods=['GET'])
def get_resume_template(template_id):
    templates = get_all_static()
    for t in templates:
        if t["template_id"] == template_id:
            return jsonify(t)
    return jsonify({'error': 'Template not found'}), 404

# TODO: For users to create their own resumes
@resume_template_bp.route('/resume-templates', methods=['POST'])
def create_resume_template():
    # TODO: Create a new resume template from request data
    return jsonify({}), 201

@resume_template_bp.route('/resume-templates/<int:template_id>', methods=['PUT'])
def update_resume_template(template_id):
    # TODO: Update an existing resume template
    return jsonify({})

@resume_template_bp.route('/resume-templates/<int:template_id>', methods=['DELETE'])
def delete_resume_template(template_id):
    # TODO: Delete a resume template
    return '', 204
