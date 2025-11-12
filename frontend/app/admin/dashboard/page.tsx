"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";

/**
 * Admin Dashboard page
 * - Uses project theme variables from globals.css (e.g. --color-primary, --color-secondary, --color-accent)
 * - Tabs (pills) navigation
 * - Dashboard tab: summary + customers table
 * - Projects tab: create / update (prompt) / delete
 * - Catalogs tab: upload / delete
 * - Users tab: owner-only promote/demote by email
 */

interface DashboardSummary {
  totalProjects: number;
  totalCatalogs: number;
  totalUsers: number;
}

interface DecodedToken {
  id: number;
  email: string;
  role: "admin" | "owner" | "customer";
  exp?: number;
}

interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  created_at?: string;
  role?: string;
}

export interface Project {
  id?: number;
  name: string;
  description: string;
  image_urls: string;
  created_at?: Date;
  updated_at?: Date;
}

interface Catalog {
  id?: number;
  title?: string;
  description?: string;
  file_path?: string;
}

const API_URL = "http://localhost:5000";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth / data state
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const [customers, setCustomers] = useState<User[]>([]);

  const [admins, setAdmins] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);

  const [tab, setTab] = useState<
    "dashboard" | "projects" | "catalogs" | "users"
  >("dashboard");

  // forms / controls
  const [newProject, setNewProject] = useState<{
    name: string;
    description: string;
    images: FileList | null;
  }>({
    name: "",
    description: "",
    images: null,
  });

  const [newCatalog, setNewCatalog] = useState<{
    title: string;
    description: string;
    file: File | null;
  }>({ title: "", description: "", file: null });
  const [emailAction, setEmailAction] = useState("");

  // token + decoded
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decoded: DecodedToken | null = token ? jwtDecode(token) : null;

  // Ensure auth + fetch initial data
  useEffect(() => {
    if (!token) {
      router.replace("/signin");
      return;
    }
    // only allow admin/owner
    if (decoded && decoded.role !== "admin" && decoded.role !== "owner") {
      router.replace("/");
      return;
    }

    // fetch summary + customers + projects + catalogs
    fetchDashboard();
    fetchCustomers(); // show customers in dashboard
    fetchProjects();
    fetchAdmins();
    fetchCatalogs();
  }, []);

  // -------------------------
  // FETCHERS
  // -------------------------
  const fetchDashboard = async () => {
    if (!token) return;
    try {
      const res = await axios.get<{ message: string; data: DashboardSummary }>(
        `${API_URL}/api/admin/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(res.data.data);
    } catch (err) {
      console.error("fetchDashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    if (!token) return;
    try {
      const res = await axios.get<{ message: string; customers: User[] }>(
        `${API_URL}/api/admin/customers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error("fetchCustomers:", err);
    }
  };
  const fetchAdmins = async () => {
    if (!token) return;
    try {
      const res = await axios.get<{ message: string; customers: User[] }>(
        `${API_URL}/api/admin/admins`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(res.data.customers || []);
    } catch (err) {
      console.error("fetchCustomers:", err);
    }
  };

  const fetchProjects = async () => {
    if (!token) return;
    try {
      // your projects controller returns rows as an array directly — handle both shapes
      const res = await axios.get<Project[] | { projects: Project[] }>(
        `${API_URL}/api/projects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // support both: res.data may be an array or { projects: [...] }
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data as any).projects;
      setProjects(data || []);
    } catch (err) {
      console.error("fetchProjects:", err);
      setProjects([]);
    }
  };

  const fetchCatalogs = async () => {
    if (!token) return;
    try {
      const res = await axios.get<Catalog[] | { catalogs: Catalog[] }>(
        `${API_URL}/api/catalogs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data as any).catalogs;
      setCatalogs(data || []);
    } catch (err) {
      console.error("fetchCatalogs:", err);
      setCatalogs([]);
    }
  };

  // -------------------------
  // PROJECT ACTIONS
  // -------------------------
  const createProject = async () => {
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append("name", newProject.name);
      formData.append("description", newProject.description);

      // ✅ Append each file to the FormData
      if (newProject.images) {
        for (let i = 0; i < newProject.images.length; i++) {
          formData.append("images", newProject.images[i]);
        }
      }

      await axios.post(`${API_URL}/api/admin/projects`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNewProject({ name: "", description: "", images: null });
      fetchProjects();
      fetchDashboard();
    } catch (err) {
      console.error("createProject:", err);
    }
  };
  const updateProject = async (id?: number) => {
    if (!token || !id) return;
    const name = prompt("New project name:");
    const description = prompt("New project description:");
    const image_urls = prompt("New image URLs (comma-separated):");
    if (!name || !description) return;

    try {
      const imageArray = image_urls
        ? image_urls.split(",").map((url) => url.trim())
        : [];

      await axios.put(
        `${API_URL}/api/projects/${id}`,
        { name, description, image_urls: imageArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchProjects();
      fetchDashboard();
    } catch (err) {
      console.error("updateProject:", err);
    }
  };

  const deleteProject = async (id?: number) => {
    if (!token || !id) return;
    if (!confirm("Delete this project?")) return;
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
      fetchDashboard();
    } catch (err) {
      console.error("deleteProject:", err);
    }
  };

  // -------------------------
  // CATALOG ACTIONS (admin)
  // -------------------------
  const uploadCatalog = async () => {
    if (!token || !newCatalog.file) return;
    try {
      const formData = new FormData();
      formData.append("title", newCatalog.title);
      formData.append("description", newCatalog.description);
      formData.append("file", newCatalog.file);

      await axios.post(`${API_URL}/api/admin/catalogs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNewCatalog({ title: "", description: "", file: null });
      fetchCatalogs();
      fetchDashboard();
    } catch (err) {
      console.error("uploadCatalog:", err);
    }
  };

  const deleteCatalog = async (id?: number) => {
    if (!token || !id) return;
    if (!confirm("Delete this catalog?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/catalogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCatalogs();
      fetchDashboard();
    } catch (err) {
      console.error("deleteCatalog:", err);
    }
  };

  // -------------------------
  // OWNER ACTIONS (promote / demote by email)
  // -------------------------
  const promoteUser = async () => {
    if (!token || !emailAction) return;
    try {
      await axios.put(
        `${API_URL}/api/admin/promote`,
        { email: emailAction },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmailAction("");
      fetchCustomers();
      fetchDashboard();
      alert("User promoted (if existed)");
    } catch (err) {
      console.error("promoteUser:", err);
      alert("Failed to promote user");
    }
  };

  const demoteUser = async () => {
    if (!token || !emailAction) return;
    try {
      await axios.put(
        `${API_URL}/api/admin/demote`,
        { email: emailAction },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmailAction("");
      fetchCustomers();
      fetchDashboard();
      alert("User demoted (if existed)");
    } catch (err) {
      console.error("demoteUser:", err);
      alert("Failed to demote user");
    }
  };

  // -------------------------
  // Loading guard
  // -------------------------
  if (loading)
    return (
      <div className="py-20 text-center">
        <div style={{ color: "var(--color-accent)" }}>Loading...</div>
      </div>
    );

  // -------------------------
  // Render
  // -------------------------
  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{
        backgroundColor: "var(--color-secondary)",
        color: "var(--color-accent)",
      }}
    >
      <h1
        className="text-4xl font-bold text-center mb-8"
        style={{
          color: "var(--color-primary)",
          fontFamily: "var(--font-heading)",
          marginTop: "2rem", // Added margin to move it down
        }}
      >
        Dashboard Control
      </h1>

      {/* Tabs (pills) */}
      <div className="flex justify-center mb-8">
        <nav
          className="inline-flex items-center rounded-xl p-1"
          style={{ backgroundColor: "var(--color-dark)" }}
        >
          <TabPill
            active={tab === "dashboard"}
            onClick={() => setTab("dashboard")}
          >
            📊 Dashboard
          </TabPill>
          <TabPill
            active={tab === "projects"}
            onClick={() => setTab("projects")}
          >
            🧱 Projects
          </TabPill>
          <TabPill
            active={tab === "catalogs"}
            onClick={() => setTab("catalogs")}
          >
            📚 Catalogs
          </TabPill>
          {decoded?.email === "marwanahmed@example.com" && (
            <TabPill active={tab === "users"} onClick={() => setTab("users")}>
              👑 Owners
            </TabPill>
          )}
        </nav>
      </div>

      {/* ===== DASHBOARD TAB (summary + customers table) ===== */}
      {tab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <SummaryCard
              title="📦 Total Projects"
              value={summary?.totalProjects ?? 0}
            />
            <SummaryCard
              title="📚 Total Catalogs"
              value={summary?.totalCatalogs ?? 0}
            />
            <SummaryCard
              title="👤 Total Users"
              value={summary?.totalUsers ?? 0}
            />
          </div>

          {/* Customers table */}
          <div className="bg-[var(--color-dark)] p-4 rounded-2xl shadow">
            <h2 className="section-title">Customers</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Location</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center"
                        style={{ color: "var(--color-accent)" }}
                      >
                        No customers found
                      </td>
                    </tr>
                  )}
                  {customers.map((u) => (
                    <tr
                      key={u.id}
                      style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}
                    >
                      <td className="px-4 py-3">{u.id}</td>
                      <td className="px-4 py-3">{u.name ?? "-"}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.phone ?? "-"}</td>
                      <td className="px-4 py-3">{u.location ?? "-"}</td>
                      <td className="px-4 py-3">{u.created_at ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ===== PROJECTS TAB ===== */}
      {tab === "projects" && (
        <div>
          <h2 className="section-title mb-4">Manage Projects</h2>

          {/* ✅ Create Project Section */}
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-[var(--color-dark)] p-4 rounded-2xl shadow">
            <input
              className="input flex-1"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />
            <input
              className="input flex-1"
              placeholder="Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />

            {/* ✅ Styled Upload Button */}
            <label
              htmlFor="project-images"
              className="cursor-pointer bg-[var(--color-primary)] text-[var(--color-secondary)] px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              📸 Upload Images
            </label>
            <input
              id="project-images"
              type="file"
              multiple
              className="hidden"
              onChange={(e) =>
                setNewProject({ ...newProject, images: e.target.files })
              }
            />

            {/* ✅ Show selected file names */}
            {newProject.images && newProject.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 w-full">
                {Array.from(newProject.images).map((file, i) => (
                  <span
                    key={i}
                    className="text-sm px-2 py-1 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-md"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            )}

            <button
              className="btn-primary"
              onClick={createProject}
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-secondary)",
              }}
            >
              Create
            </button>
          </div>

          {/* ✅ Project List */}
          <div className="overflow-x-auto bg-[var(--color-dark)] p-4 rounded-2xl shadow">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Images</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No projects found
                    </td>
                  </tr>
                )}
                {projects.map((p) => (
                  <tr
                    key={p.id}
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-300">
                      {p.description || "-"}
                    </td>

                    {/* ✅ Show Image Links */}
                    <td className="px-4 py-3 max-w-[300px] break-words">
                      {Array.isArray(p.image_urls) &&
                      p.image_urls.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {p.image_urls.map((url: string, i: number) => {
                            let finalUrl = url;

                            // ✅ If it's not a full URL, ensure proper joining with API_URL
                            if (!url.startsWith("http")) {
                              // Remove any leading slashes to prevent double-slash issues
                              finalUrl = `${API_URL.replace(
                                /\/$/,
                                ""
                              )}/${url.replace(/^\/+/, "")}`;
                            }

                            return (
                              <a
                                key={i}
                                href={finalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-blue-400 hover:text-blue-300 text-sm"
                              >
                                Image {i + 1}
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-500">No images</span>
                      )}
                    </td>

                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="btn-primary"
                        onClick={() => deleteProject(p.id)}
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "var(--color-secondary)",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== CATALOGS TAB ===== */}
      {tab === "catalogs" && (
        <div>
          <h2 className="section-title mb-4">Manage Catalogs</h2>

          {/* ✅ Create Catalog Section */}
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-[var(--color-dark)] p-4 rounded-2xl shadow">
            <input
              className="input flex-1"
              placeholder="Title"
              value={newCatalog.title}
              onChange={(e) =>
                setNewCatalog({ ...newCatalog, title: e.target.value })
              }
            />
            <input
              className="input flex-1"
              placeholder="Description"
              value={newCatalog.description}
              onChange={(e) =>
                setNewCatalog({ ...newCatalog, description: e.target.value })
              }
            />

            {/* ✅ Styled File Upload Button */}
            <label
              htmlFor="catalog-file"
              className="cursor-pointer bg-[var(--color-primary)] text-[var(--color-secondary)] px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              📄 Select File
            </label>
            <input
              id="catalog-file"
              type="file"
              className="hidden"
              onChange={(e) =>
                setNewCatalog({
                  ...newCatalog,
                  file: e.target.files?.[0] ?? null,
                })
              }
            />

            {/* ✅ Show selected file name */}
            {newCatalog.file && (
              <span className="text-sm px-2 py-1 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-md">
                {newCatalog.file.name}
              </span>
            )}

            <button
              className="btn-primary"
              onClick={uploadCatalog}
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-secondary)",
              }}
            >
              Upload
            </button>
          </div>

          {/* ✅ Catalogs List */}
          <div className="overflow-x-auto bg-[var(--color-dark)] p-4 rounded-2xl shadow">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-900/30">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">File</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {catalogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No catalogs found
                    </td>
                  </tr>
                ) : (
                  catalogs.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-3">{c.id}</td>
                      <td className="px-4 py-3 font-medium">{c.title}</td>
                      <td className="px-4 py-3">
                        {c.file_path ? (
                          <a
                            href={`${API_URL}/${c.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-blue-400 hover:text-blue-300 text-sm"
                          >
                            {c.file_path.split("/").pop()}
                          </a>
                        ) : (
                          <span className="text-gray-500">No file</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="btn-primary"
                          onClick={() => deleteCatalog(c.id)}
                          style={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-secondary)",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== USERS TAB ===== */}
      {tab === "users" && decoded?.email === "marwanahmed@example.com" && (
        <div>
          <h2 className="section-title mb-4">Manage Admins</h2>

          {/* ✅ Promote/Demote Section */}
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-[var(--color-dark)] p-4 rounded-2xl shadow">
            <input
              className="input flex-1"
              placeholder="User email"
              value={emailAction}
              onChange={(e) => setEmailAction(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="btn-primary"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-secondary)",
                }}
                onClick={() => {
                  promoteUser();
                }}
              >
                Promote
              </button>
              <button
                className="btn-secondary"
                style={{
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                }}
                onClick={() => {
                  demoteUser();
                }}
              >
                Demote
              </button>
            </div>
            <p style={{ color: "var(--color-accent)" }} className="text-sm">
              Only owners can actually promote or demote users.
            </p>
          </div>

          {/* ✅ Users List */}
          <div className="overflow-x-auto bg-[var(--color-dark)] p-4 rounded-2xl shadow">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-900/30">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  admins.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-3">{u.id}</td>
                      <td className="px-4 py-3 font-medium">{u.name ?? "-"}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.role ?? "-"}</td>
                      <td className="px-4 py-3">{u.phone ?? "-"}</td>
                      <td className="px-4 py-3">{u.location ?? "-"}</td>
                      <td className="px-4 py-3">{u.created_at ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================
   Helper small components
   ==================== */

function TabPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-lg font-semibold transition-all`}
      style={{
        backgroundColor: active ? "var(--color-primary)" : "transparent",
        color: active ? "var(--color-secondary)" : "var(--color-accent)",
        border: active
          ? `2px solid var(--color-primary)`
          : "2px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div
      className="p-6 rounded-2xl shadow"
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-accent)",
      }}
    >
      <h3
        style={{ color: "var(--color-primary)" }}
        className="text-lg font-semibold mb-2"
      >
        {title}
      </h3>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
