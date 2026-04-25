from flask import Blueprint, jsonify, request
# from model.resume_template import ResumeTemplate

resume_template_bp = Blueprint('resume_template', __name__)

@resume_template_bp.route('/resume-templates', methods=['GET'])
def list_resume_templates():
    # TODO: Fetch all resume templates from the database
    return jsonify([])

@resume_template_bp.route('/resume-templates/<int:template_id>', methods=['GET'])
def get_resume_template(template_id):
    # TODO: Fetch a single resume template by id
    return jsonify({})

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
