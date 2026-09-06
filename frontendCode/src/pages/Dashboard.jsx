import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Search,
  Briefcase,
  Calendar,
  Trophy,
  Edit2,
  X,
  Clock,
  Bell,
  UserCheck,
  Mail,
  Link,
} from "lucide-react";

const STAGES = ["WISHLIST", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED"];

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // Create Form State
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("WISHLIST");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterLinkedin, setRecruiterLinkedin] = useState("");

  // Edit / Details Modal State
  const [editingJob, setEditingJob] = useState(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("WISHLIST");
  const [editSalary, setEditSalary] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editAppliedDate, setEditAppliedDate] = useState("");
  const [editInterviewDate, setEditInterviewDate] = useState("");
  const [editRecruiterName, setEditRecruiterName] = useState("");
  const [editRecruiterEmail, setEditRecruiterEmail] = useState("");
  const [editRecruiterLinkedin, setEditRecruiterLinkedin] = useState("");

  // Drag-and-Drop Active Column State
  const [draggedOverStage, setDraggedOverStage] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const resetCreateForm = () => {
    setCompany("");
    setRole("");
    setStatus("WISHLIST");
    setSalary("");
    setNotes("");
    setAppliedDate("");
    setInterviewDate("");
    setRecruiterName("");
    setRecruiterEmail("");
    setRecruiterLinkedin("");
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        company,
        role,
        status,
        salary,
        notes,
        appliedDate: appliedDate || undefined,
        interviewDate: interviewDate || undefined,
        recruiterName,
        recruiterEmail,
        recruiterLinkedin,
      };
      const res = await API.post("/jobs", payload);
      setJobs([res.data, ...jobs]);
      resetCreateForm();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add job:", err);
      alert(err.response?.data?.error || "Failed to add job");
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      const res = await API.patch(`/jobs/${jobId}`, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j._id === jobId ? res.data : j)));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      if (editingJob && editingJob._id === jobId) {
        setEditingJob(null);
      }
    } catch (err) {
      console.error("Failed to delete job:", err);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setEditCompany(job.company || "");
    setEditRole(job.role || "");
    setEditStatus(job.status || "WISHLIST");
    setEditSalary(job.salary || "");
    setEditNotes(job.notes || "");
    setEditAppliedDate(
      job.appliedDate ? new Date(job.appliedDate).toISOString().split("T")[0] : ""
    );
    setEditInterviewDate(
      job.interviewDate
        ? new Date(job.interviewDate).toISOString().split("T")[0]
        : ""
    );
    setEditRecruiterName(job.recruiterName || "");
    setEditRecruiterEmail(job.recruiterEmail || "");
    setEditRecruiterLinkedin(job.recruiterLinkedin || "");
  };

  // Submit Edit Form
  const handleUpdateJobDetails = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      const updatedPayload = {
        company: editCompany,
        role: editRole,
        status: editStatus,
        salary: editSalary,
        notes: editNotes,
        appliedDate: editAppliedDate || null,
        interviewDate: editInterviewDate || null,
        recruiterName: editRecruiterName,
        recruiterEmail: editRecruiterEmail,
        recruiterLinkedin: editRecruiterLinkedin,
      };

      const res = await API.patch(`/jobs/${editingJob._id}`, updatedPayload);
      setJobs((prev) => prev.map((j) => (j._id === editingJob._id ? res.data : j)));
      setEditingJob(null);
    } catch (err) {
      console.error("Failed to update job details:", err);
      alert(err.response?.data?.error || "Failed to update job details");
    }
  };

  // Helper functions
  const getDaysAgo = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const formatInterviewDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e, jobId) => {
    e.dataTransfer.setData("text/plain", jobId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedOverStage !== stage) {
      setDraggedOverStage(stage);
    }
  };

  const handleDragLeave = (e, stage) => {
    e.preventDefault();
    if (draggedOverStage === stage) {
      setDraggedOverStage(null);
    }
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    setDraggedOverStage(null);
    const jobId = e.dataTransfer.getData("text/plain");

    if (!jobId) return;

    const currentJob = jobs.find((j) => j._id === jobId);
    if (currentJob && currentJob.status !== targetStage) {
      await handleUpdateStatus(jobId, targetStage);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      (job.company && job.company.toLowerCase().includes(search.toLowerCase())) ||
      (job.role && job.role.toLowerCase().includes(search.toLowerCase())) ||
      (job.recruiterName && job.recruiterName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-3">
            <Briefcase className="w-8 h-8 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Tracked</p>
              <h3 className="text-xl font-bold text-gray-800">{jobs.length}</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Applied</p>
              <h3 className="text-xl font-bold text-gray-800">
                {jobs.filter((j) => j.status === "APPLIED").length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-3">
            <Bell className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Upcoming Interviews</p>
              <h3 className="text-xl font-bold text-gray-800">
                {jobs.filter((j) => j.interviewDate || j.status === "INTERVIEWING").length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Offers</p>
              <h3 className="text-xl font-bold text-gray-800">
                {jobs.filter((j) => j.status === "OFFER").length}
              </h3>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search company, role, recruiter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Job Card</span>
          </button>
        </div>

        {/* Board Columns */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading jobs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STAGES.map((stage) => {
              const stageJobs = filteredJobs.filter((job) => job.status === stage);
              const isOver = draggedOverStage === stage;

              return (
                <div
                  key={stage}
                  onDragOver={(e) => handleDragOver(e, stage)}
                  onDragLeave={(e) => handleDragLeave(e, stage)}
                  onDrop={(e) => handleDrop(e, stage)}
                  className={`p-4 rounded-lg flex flex-col min-h-[500px] transition-colors ${
                    isOver ? "bg-indigo-50 border-2 border-dashed border-indigo-400" : "bg-gray-200/70"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-gray-700 text-sm tracking-wide">
                      {stage}
                    </h2>
                    <span className="bg-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
                      {stageJobs.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {stageJobs.map((job) => {
                      const currentIndex = STAGES.indexOf(job.status);
                      const daysAgo = getDaysAgo(job.appliedDate || job.createdAt);
                      const formattedInterview = formatInterviewDate(job.interviewDate);

                      return (
                        <div
                          key={job._id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, job._id)}
                          className="bg-white p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition cursor-grab active:cursor-grabbing space-y-2.5"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-800">{job.company}</h3>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleOpenEditModal(job)}
                                className="text-gray-400 hover:text-indigo-600 transition p-1"
                                title="Edit / Details"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job._id)}
                                className="text-gray-400 hover:text-red-600 transition p-1"
                                title="Delete Job"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 font-medium">{job.role}</p>

                          {job.salary && (
                            <p className="text-xs text-emerald-600 font-semibold">{job.salary}</p>
                          )}

                          {/* Recruiter Details Card Badge */}
                          {(job.recruiterName || job.recruiterEmail || job.recruiterLinkedin) && (
                            <div className="bg-slate-50 border border-slate-200 p-2 rounded text-xs text-gray-700 space-y-1">
                              {job.recruiterName && (
                                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                                  <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>{job.recruiterName}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 pt-0.5">
                                {job.recruiterEmail && (
                                  <a
                                    href={`mailto:${job.recruiterEmail}`}
                                    className="text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                                    title={job.recruiterEmail}
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[120px]">{job.recruiterEmail}</span>
                                  </a>
                                )}
                                {job.recruiterLinkedin && (
                                  <a
                                    href={job.recruiterLinkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                                  >
                                    <Linkedin className="w-3.5 h-3.5" />
                                    <span>Profile</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Applied & Interview Badges */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {daysAgo && (
                              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded font-medium">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {daysAgo}
                              </span>
                            )}

                            {formattedInterview && (
                              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] px-2 py-0.5 rounded font-semibold">
                                <Bell className="w-3 h-3 text-amber-500" />
                                Interview: {formattedInterview}
                              </span>
                            )}
                          </div>

                          {job.notes && (
                            <p className="text-xs text-gray-500 line-clamp-2 bg-gray-50 p-1.5 rounded border border-gray-100">
                              {job.notes}
                            </p>
                          )}

                          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            {currentIndex > 0 ? (
                              <button
                                onClick={() => handleUpdateStatus(job._id, STAGES[currentIndex - 1])}
                                className="text-gray-500 hover:text-indigo-600 p-1"
                                title="Move Left"
                              >
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                            ) : <div />}

                            {currentIndex < STAGES.length - 1 && (
                              <button
                                onClick={() => handleUpdateStatus(job._id, STAGES[currentIndex + 1])}
                                className="text-gray-500 hover:text-indigo-600 p-1"
                                title="Move Right"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Job Application</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="Google"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position / Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="Software Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Recruiter Details Section */}
              <div className="border-t pt-3 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recruiter Details</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Name</label>
                  <input
                    type="text"
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={recruiterLinkedin}
                      onChange={(e) => setRecruiterLinkedin(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="$120k/yr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Stage</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none h-20 text-sm"
                  placeholder="Referral links, preparation notes..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                >
                  Save Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Details Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-xl font-bold text-gray-800">Job Details & Edit</h2>
              <button
                onClick={() => setEditingJob(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateJobDetails} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position / Role</label>
                <input
                  type="text"
                  required
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                  <input
                    type="date"
                    value={editAppliedDate}
                    onChange={(e) => setEditAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={editInterviewDate}
                    onChange={(e) => setEditInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Edit Recruiter Section */}
              <div className="border-t pt-3 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recruiter Details</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter Name</label>
                  <input
                    type="text"
                    value={editRecruiterName}
                    onChange={(e) => setEditRecruiterName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editRecruiterEmail}
                      onChange={(e) => setEditRecruiterEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editRecruiterLinkedin}
                      onChange={(e) => setEditRecruiterLinkedin(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="text"
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Stage</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes & Links</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none h-24 text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                >
                  Update Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;