import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TrackerForm() {
  const [form, setForm] = useState({
    company: '', role: '', status: '', applied_date: ''
  });

  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [resume, setResume] = useState(null);

  // Fetch all job applications from backend
  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/applications');
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching job applications:", error);
    }
  };

  // Load job applications on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Submit form (with resume file upload)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('company', form.company);
    formData.append('role', form.role);
    formData.append('status', form.status);
    formData.append('applied_date', form.applied_date);
    if (resume) formData.append('resume', resume);
  
    try {
      await axios.post('http://localhost:5000/applications', formData);
      alert('Saved!');
      setForm({ company: '', role: '', status: '', applied_date: '' });
      setResume(null);
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };
  
  // Delete job by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job application?")) return;

    try {
      await axios.delete(`http://localhost:5000/applications/${id}`);
      fetchJobs(); // Refresh list
    } catch (error) {
      console.error("Error deleting job application:", error);
    }
  };

  // Edit job by ID
  const handleEdit = (job) => {
    setEditId(job.id);
    setEditForm(job);
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/applications/${id}`, editForm);
      setEditId(null);
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  return (
    <div className="container mt-4">
      <h2>Add Job Application</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Company"
          value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
        <input className="form-control mb-2" placeholder="Role"
          value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
        <input className="form-control mb-2" placeholder="Status"
          value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} required />
        <input className="form-control mb-2" type="date"
          value={form.applied_date} onChange={e => setForm({ ...form, applied_date: e.target.value })} required />
        <input className="form-control mb-2" type="file"
          accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
        <button className="btn btn-primary" type="submit">Submit</button>
      </form>

      <div className="row mt-4 mb-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by company, role or status"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>
      </div>

      <h3 className="mt-4">Job Applications</h3>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Applied Date</th>
            <th>Resume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs
            .filter(job =>
              job.company.toLowerCase().includes(searchTerm) ||
              job.role.toLowerCase().includes(searchTerm) ||
              job.status.toLowerCase().includes(searchTerm)
            )
            .map((job, index) => (
              <tr key={job.id}>
                <td>{index + 1}</td>
                {editId === job.id ? (
                  <>
                    <td><input value={editForm.company} className="form-control"
                      onChange={e => handleEditChange("company", e.target.value)} /></td>
                    <td><input value={editForm.role} className="form-control"
                      onChange={e => handleEditChange("role", e.target.value)} /></td>
                    <td><input value={editForm.status} className="form-control"
                      onChange={e => handleEditChange("status", e.target.value)} /></td>
                    <td><input type="date" value={editForm.applied_date} className="form-control"
                      onChange={e => handleEditChange("applied_date", e.target.value)} /></td>
                    <td><em>Cannot edit resume</em></td>
                    <td>
                      <button className="btn btn-sm btn-success me-1"
                        onClick={() => handleEditSubmit(job.id)}>Save</button>
                      <button className="btn btn-sm btn-secondary"
                        onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{job.company}</td>
                    <td>{job.role}</td>
                    <td>{job.status}</td>
                    <td>{job.applied_date}</td>
                    <td>
                      {job.resume_filename ? (
                        <a href={`http://localhost:5000/resumes/${job.resume_filename}`} target="_blank" rel="noreferrer">
                          View Resume
                        </a>
                      ) : (
                        <em>No file</em>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-warning me-1"
                        onClick={() => handleEdit(job)}>Edit</button>
                      <button className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(job.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrackerForm;