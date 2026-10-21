
import React, { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  BookOpen,
  CalendarCheck,
  Search,
  GraduationCap,
  Clock,
  CheckCircle,
  Plus,
  CircleCheck,
} from "lucide-react";
import "./styles.css";

const initialNotices = [
  {
    title: "Mid-Semester Examination",
    detail: "Examination timetable will be announced soon.",
    date: "19 Oct 2026",
  },
  {
    title: "Project Submission",
    detail: "Submit your project report to your department.",
    date: "18 Oct 2026",
  },
  {
    title: "Campus Announcement",
    detail: "Keep your student ID card with you on campus.",
    date: "17 Oct 2026",
  },
];

const initialAssignments = [
  {
    id: 1,
    subject: "Data Structures",
    task: "Complete sorting algorithms",
    due: "2026-10-22",
    status: "Pending",
  },
  {
    id: 2,
    subject: "Database Systems",
    task: "Submit SQL practical file",
    due: "2026-10-24",
    status: "Pending",
  },
  {
    id: 3,
    subject: "Java Programming",
    task: "Create a thread example",
    due: "2026-10-26",
    status: "Completed",
  },
];

const initialAttendance = [
  { id: 1, subject: "Data Structures", attended: 23, total: 25 },
  { id: 2, subject: "Database Systems", attended: 22, total: 24 },
  { id: 3, subject: "Java Programming", attended: 23, total: 25 },
];

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Student");

  const [notices, setNotices] = useState(() =>
    loadData("campushub-notices", initialNotices)
  );

  const [assignments, setAssignments] = useState(() =>
    loadData("campushub-assignments", initialAssignments)
  );

  const [attendance, setAttendance] = useState(() =>
    loadData("campushub-attendance", initialAttendance)
  );

  const [newNotice, setNewNotice] = useState("");
  const [subject, setSubject] = useState("");
  const [task, setTask] = useState("");
  const [due, setDue] = useState("");

  function saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch {
      alert("Data save nahi ho paya. Browser storage check karo.");
      return false;
    }
  }

  function addNotice() {
    const title = newNotice.trim();
    if (!title) {
      alert("Notice title likho.");
      return;
    }

    const updated = [
      {
        title,
        detail: "New campus notice",
        date: new Date().toLocaleDateString("en-IN"),
      },
      ...notices,
    ];

    if (saveData("campushub-notices", updated)) {
      setNotices(updated);
      setNewNotice("");
    }
  }

  function addAssignment() {
    if (!subject.trim() || !task.trim() || !due) {
      alert("Subject, assignment aur due date bharo.");
      return;
    }

    const updated = [
      {
        id: Date.now(),
        subject: subject.trim(),
        task: task.trim(),
        due,
        status: "Pending",
      },
      ...assignments,
    ];

    if (saveData("campushub-assignments", updated)) {
      setAssignments(updated);
      setSubject("");
      setTask("");
      setDue("");
    }
  }

  function toggleAssignment(id) {
    const updated = assignments.map((item) =>
      item.id === id
        ? {
            ...item,
            status:
              item.status === "Completed" ? "Pending" : "Completed",
          }
        : item
    );

    if (saveData("campushub-assignments", updated)) {
      setAssignments(updated);
    }
  }

  function updateAttendance(id, field, value) {
    const updated = attendance.map((item) => {
      if (item.id !== id) return item;

      let attended = item.attended;
      let total = item.total;

      if (field === "attended") {
        attended = Math.max(0, Math.min(Number(value), total));
      } else {
        total = Math.max(item.attended, Number(value));
        attended = Math.min(attended, total);
      }

      return { ...item, attended, total };
    });

    if (saveData("campushub-attendance", updated)) {
      setAttendance(updated);
    }
  }

  const filteredNotices = notices.filter((item) =>
    `${item.title} ${item.detail}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredAssignments = assignments.filter((item) =>
    `${item.subject} ${item.task} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalAttended = attendance.reduce(
    (sum, item) => sum + item.attended,
    0
  );
  const totalClasses = attendance.reduce(
    (sum, item) => sum + item.total,
    0
  );
  const overallAttendance = totalClasses
    ? Math.round((totalAttended / totalClasses) * 100)
    : 0;

  const pendingCount = assignments.filter(
    (item) => item.status === "Pending"
  ).length;

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Notices", icon: Bell },
    { name: "Assignments", icon: BookOpen },
    { name: "Attendance", icon: CalendarCheck },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>
          <div>
            <strong>CampusHub</strong>
            <span>SMART CAMPUS</span>
          </div>
        </div>

        <p className="nav-label">MAIN MENU</p>

        <nav>
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${
                activePage === name ? "active" : ""
              }`}
              onClick={() => setActivePage(name)}
            >
              <Icon size={19} />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <strong>Need help?</strong>
          <p>Contact campus support</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Campus / <strong>{activePage}</strong>
          </div>

          <div className="top-actions">
            <label className="search-box">
              <Search size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
              />
            </label>

            <button
              className="notification-button"
              onClick={() => setActivePage("Notices")}
              aria-label="Open notices"
            >
              <Bell size={19} />
            </button>

            <div className="profile">
              <div className="avatar">DN</div>
              <div className="profile-text">
                <strong>Campus Member</strong>
                <span>{role}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">SMART CAMPUS MANAGEMENT</p>
              <h1>
                {activePage === "Dashboard"
                  ? "Welcome back!"
                  : activePage}
              </h1>
              <p className="subtitle">
                {activePage === "Dashboard"
                  ? "Here's what's happening on your campus today."
                  : `View and manage your campus ${activePage.toLowerCase()}.`}
              </p>
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-select"
            >
              <option>Student</option>
              <option>Admin (Demo)</option>
            </select>
          </div>

          {activePage === "Dashboard" && (
            <>
              <div className="stats-grid">
                <StatCard
                  icon={<BookOpen />}
                  color="purple"
                  label="Total Courses"
                  value={attendance.length}
                  note="Subjects in this demo"
                />
                <StatCard
                  icon={<CalendarCheck />}
                  color="green"
                  label="Attendance"
                  value={`${overallAttendance}%`}
                  note="Based on demo records"
                />
                <StatCard
                  icon={<Bell />}
                  color="orange"
                  label="New Notices"
                  value={notices.length}
                  note="Campus announcements"
                />
                <StatCard
                  icon={<CheckCircle />}
                  color="blue"
                  label="Pending Assignments"
                  value={pendingCount}
                  note="Tasks to complete"
                />
              </div>

              <div className="content-grid">
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Recent Notices</h2>
                      <p>Latest campus announcements</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setActivePage("Notices")}
                    >
                      View all →
                    </button>
                  </div>
                  <NoticeList notices={filteredNotices.slice(0, 3)} />
                </section>

                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Quick Overview</h2>
                      <p>Your academic summary</p>
                    </div>
                  </div>
                  <div className="overview-item">
                    <BookOpen size={20} />
                    <div>
                      <strong>{attendance.length} Subjects</strong>
                      <p>In attendance records</p>
                    </div>
                  </div>
                  <div className="overview-item">
                    <CalendarCheck size={20} />
                    <div>
                      <strong>{overallAttendance}% Attendance</strong>
                      <p>Across listed subjects</p>
                    </div>
                  </div>
                  <div className="overview-item">
                    <Clock size={20} />
                    <div>
                      <strong>{pendingCount} Pending</strong>
                      <p>Assignments to complete</p>
                    </div>
                  </div>
                  <p className="subtitle">Attendance progress</p>
                  <progress value={overallAttendance} max="100" />
                </section>
              </div>
            </>
          )}

          {activePage === "Notices" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h2>Campus Notices</h2>
                  <p>Stay updated with announcements</p>
                </div>
              </div>

              {role === "Admin (Demo)" && (
                <div className="add-notice">
                  <input
                    value={newNotice}
                    onChange={(e) => setNewNotice(e.target.value)}
                    placeholder="Enter a new notice title"
                  />
                  <button className="primary-button" onClick={addNotice}>
                    <Plus size={16} /> Add Notice
                  </button>
                </div>
              )}

              <NoticeList notices={filteredNotices} />
              {filteredNotices.length === 0 && (
                <p>No matching notices found.</p>
              )}
            </section>
          )}

          {activePage === "Assignments" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h2>My Assignments</h2>
                  <p>
                    {pendingCount} pending ·{" "}
                    {assignments.length - pendingCount} completed
                  </p>
                </div>
              </div>

              {role === "Admin (Demo)" && (
                <div className="assignment-form">
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject name"
                  />
                  <input
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Assignment title"
                  />
                  <label>
                    Due date
                    <input
                      type="date"
                      value={due}
                      onChange={(e) => setDue(e.target.value)}
                    />
                  </label>
                  <button
                    className="primary-button"
                    onClick={addAssignment}
                  >
                    <Plus size={16} /> Add Assignment
                  </button>
                </div>
              )}

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Assignment</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.map((item) => (
                      <tr key={item.id}>
                        <td>{item.subject}</td>
                        <td>{item.task}</td>
                        <td>{item.due}</td>
                        <td>
                          <span
                            className={`status ${
                              item.status === "Completed"
                                ? "completed"
                                : "pending"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="text-button"
                            onClick={() => toggleAssignment(item.id)}
                          >
                            {item.status === "Completed"
                              ? "Mark Pending"
                              : "Mark Completed"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAssignments.length === 0 && (
                  <p>No assignments found.</p>
                )}
              </div>
            </section>
          )}

          {activePage === "Attendance" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h2>Attendance Summary</h2>
                  <p>
                    Overall attendance: {overallAttendance}%
                  </p>
                </div>
              </div>

              <progress value={overallAttendance} max="100" />

              <p className="subtitle">
                Admin (Demo) role mein attended aur total classes edit kar
                sakte ho. Ye sirf demo records hain.
              </p>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Attended</th>
                      <th>Total Classes</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((item) => {
                      const percent = item.total
                        ? Math.round(
                            (item.attended / item.total) * 100
                          )
                        : 0;

                      return (
                        <tr key={item.id}>
                          <td>{item.subject}</td>
                          <td>
                            {role === "Admin (Demo)" ? (
                              <input
                                className="small-number"
                                type="number"
                                min="0"
                                max={item.total}
                                value={item.attended}
                                onChange={(e) =>
                                  updateAttendance(
                                    item.id,
                                    "attended",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              item.attended
                            )}
                          </td>
                          <td>
                            {role === "Admin (Demo)" ? (
                              <input
                                className="small-number"
                                type="number"
                                min={item.attended}
                                value={item.total}
                                onChange={(e) =>
                                  updateAttendance(
                                    item.id,
                                    "total",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              item.total
                            )}
                          </td>
                          <td>
                            <strong>{percent}%</strong>
                            <progress value={percent} max="100" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <footer>
            © 2026 CampusHub · Smart Campus Management System
            <span>Local demo version</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, color, label, value, note }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{note}</span>
    </div>
  );
}

function NoticeList({ notices }) {
  return (
    <div className="notice-list">
      {notices.map((notice, index) => (
        <div
          className="notice-item"
          key={`${notice.title}-${index}`}
        >
          <div className="notice-symbol">
            <Bell size={18} />
          </div>
          <div className="notice-copy">
            <strong>{notice.title}</strong>
            <p>{notice.detail}</p>
          </div>
          <time>{notice.date}</time>
        </div>
      ))}
    </div>
  );
}

export default App;
