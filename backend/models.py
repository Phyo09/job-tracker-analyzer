from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class JobApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100))
    role = db.Column(db.String(100))
    status = db.Column(db.String(50))
    applied_date = db.Column(db.String(20))
    resume_filename = db.Column(db.String(200))
