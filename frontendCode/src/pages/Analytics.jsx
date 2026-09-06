import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Briefcase,
  TrendingUp,
  Award,
  XCircle,
  BarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

const STAGE_COLORS = {
  WISHLIST: "#94A3B8",
  APPLIED: "#3B82F6",
  INTERVIEWING: "#F59E0B",
  OFFER: "#10B981",
  REJECTED: "#EF4444",
};

const Analytics = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs for analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const totalTracked = jobs.length;
  const totalApplied = jobs.filter((j) => j.status !== "WISHLIST").length;
  const totalInterviews = jobs.filter((j) => j.status === "INTERVIEWING").length;
  const totalOffers = jobs.filter((j) => j.status === "OFFER").length;
  const totalRejected = jobs.filter((j) => j.status === "REJECTED").length;

  const interviewRate = totalApplied > 0 ? ((totalInterviews / totalApplied) * 100).toFixed(1) : 0;
  const offerRate = totalApplied > 0 ? ((totalOffers / totalApplied) * 100).toFixed(1) : 0;
  const rejectionRate = totalApplied > 0 ? ((totalRejected / totalApplied) * 100).toFixed(1) : 0;

  const stageCounts = ["WISHLIST", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED"].map(
    (stage) => ({
      name: stage,
      value: jobs.filter((j) => j.status === stage).length,
      color: STAGE_COLORS[stage],
    })
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart2 className="w-7 h-7 text-indigo-600" />
              Application Insights & Analytics
            </h1>
            <p className="text-sm text-gray-500">
              Track conversion funnels and job pipeline metrics.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Calculating analytics data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-lg border shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Total Applications</p>
                  <h3 className="text-2xl font-bold text-gray-800">{totalApplied}</h3>
                  <p className="text-xs text-gray-400">{totalTracked} total in board</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Interview Rate</p>
                  <h3 className="text-2xl font-bold text-gray-800">{interviewRate}%</h3>
                  <p className="text-xs text-amber-600 font-medium">{totalInterviews} Active Interviews</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Offer Conversion</p>
                  <h3 className="text-2xl font-bold text-gray-800">{offerRate}%</h3>
                  <p className="text-xs text-emerald-600 font-medium">{totalOffers} Offers Extended</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-full">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Rejection Rate</p>
                  <h3 className="text-2xl font-bold text-gray-800">{rejectionRate}%</h3>
                  <p className="text-xs text-gray-400">{totalRejected} Closed</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Application Pipeline Distribution</h2>
                  <p className="text-xs text-gray-500 mb-4">Current status distribution of all tracked applications.</p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stageCounts}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {stageCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} jobs`, name]} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Volume by Stage</h2>
                  <p className="text-xs text-gray-500 mb-4">Compare total job volume across all pipeline stages.</p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stageCounts}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {stageCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;