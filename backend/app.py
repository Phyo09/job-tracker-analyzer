from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, JobApplication
from resume_analyzer import analyze_resume

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobs.db'
CORS(app)
db.init_app(app)

@app.route('/applications', methods=['POST'])
def add_job():
    data = request.json
    job = JobApplication(**data)
    db.session.add(job)
    db.session.commit()
    return jsonify({"message": "Saved"}), 201

@app.route('/analyze', methods=['POST'])
def analyze():
    resume = request.files['resume'].read().decode('utf-8')
    jd = request.form['job_description']
    result = analyze_resume(resume, jd)
    return jsonify(result)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
