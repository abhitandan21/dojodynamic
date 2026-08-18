import { Outlet, NavLink, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "▣",
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: "👥",
    },
    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: "✓",
    },
    {
      name: "Attendance Report",
      path: "/admin/attendance/report",
      icon: "📊",
    },
    {
      name: "Fees",
      path: "/admin/fees",
      icon: "₹",
    },
    {
      name: "Fee History",
      path: "/admin/fees/history",
      icon: "📋",
    },
    {
      name: "Fee Reports",
      path: "/admin/fees/reports",
      icon: "📊",
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: "📦",
    },
    {
      name: "Competitions",
      path: "/competition",
      icon: "🏆",
    },
    {
      name: "Certificates",
      path: "/admin/certificates",
      icon: "▤",
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: "▥",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: "⚙",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =========================
          ADMIN TOP HEADER
      ========================== */}

      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gray-950 text-white shadow-lg">

        <div className="h-full flex items-center justify-between px-5">

          {/* Logo */}

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >

            <img
              src="/logo.png"
              alt="AMAASA"
              className="w-11 h-11 object-contain"
              onError={(e) => {
                e.currentTarget.style.display =
                  "none";
              }}
            />

            <div>

              <h1 className="font-bold text-sm md:text-base leading-tight">
                ABHISHEK MARTIAL ARTS
              </h1>

              <p className="text-red-500 font-bold text-xs md:text-sm">
                AND SPORTS ACADEMY
              </p>

            </div>

          </div>

          {/* Right */}

          <div className="flex items-center gap-4">

            <div className="hidden sm:block text-right">

              <p className="text-sm font-semibold">
                Admin
              </p>

              <p className="text-xs text-gray-400">
                AMAASA
              </p>

            </div>

            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold">
              A
            </div>

          </div>

        </div>

      </header>


      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="fixed top-16 left-0 bottom-0 z-40 w-56 bg-gray-950 text-white overflow-y-auto">

        <div className="px-5 pt-7">

          <p className="text-red-500 text-xs font-bold tracking-wider mb-5">
            ADMIN PANEL
          </p>

          <nav className="space-y-2">

            {menuItems.map((item) => (

              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${isActive
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >

                <span className="w-5 text-center">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </NavLink>

            ))}

          </nav>


          {/* Logout */}

          <div className="mt-8 pt-5 border-t border-gray-800">

            <button
              onClick={() => {
                localStorage.removeItem(
                  "user"
                );

                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-red-600 hover:text-white transition"
            >

              <span>↪</span>

              Logout

            </button>

          </div>

        </div>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="ml-56 pt-16 min-h-screen">

        <Outlet />

      </main>

    </div>
  );
};

export default AdminLayout;