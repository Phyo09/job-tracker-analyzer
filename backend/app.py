from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, JobApplication
from resume_analyzer import analyze_resume
import os
from werkzeug.utils import secure_filename
from flask import send_from_directory

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobs.db'
CORS(app)
db.init_app(app)

# Create DB tables if not exists
with app.app_context():
    db.create_all()

UPLOAD_FOLDER = 'resumes'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Add job application
@app.route('/applications', methods=['POST'])
def add_job():
    company = request.form.get('company')
    role = request.form.get('role')
    status = request.form.get('status')
    applied_date = request.form.get('applied_date')
    resume = request.files.get('resume')

    filename = None
    if resume:
        filename = secure_filename(resume.filename)
        resume.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    job = JobApplication(
        company=company,
        role=role,
        status=status,
        applied_date=applied_date,
        resume_filename=filename
    )
    db.session.add(job)
    db.session.commit()
    return jsonify({"message": "Saved"}), 201

@app.route('/resumes/<filename>')
def download_resume(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Get all job applications
@app.route('/applications', methods=['GET'])
def get_all_jobs():
    jobs = JobApplication.query.all()
    job_list = [{
        "id": job.id,
        "company": job.company,
        "role": job.role,
        "status": job.status,
        "applied_date": job.applied_date,
        "resume_filename": job.resume_filename 
    } for job in jobs]
    return jsonify(job_list)


# Update a job application by ID
@app.route('/applications/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    job = JobApplication.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    data = request.json
    job.company = data.get("company", job.company)
    job.role = data.get("role", job.role)
    job.status = data.get("status", job.status)
    job.applied_date = data.get("applied_date", job.applied_date)

    db.session.commit()
    return jsonify({"message": "Updated successfully"})

# Delete a job application by ID
@app.route('/applications/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = JobApplication.query.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"})

# Analyze resume vs job description
@app.route('/analyze', methods=['POST'])
def analyze():
    # resume = request.files['resume'].read().decode('utf-8')
    file = request.files['resume']
    resume_bytes = file.read()
    resume_text = resume_bytes.decode('utf-8', errors='ignore')  # fallback safe decoding

    jd = request.form['job_description']
    result = analyze_resume(resume_text, jd)
    result["resume_text"] = resume_text  # Add preview text
    return jsonify(result)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
