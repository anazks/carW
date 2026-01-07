import OwnerNavBar from "../Layout/OwnerNavBar";

export default function OwnerLogin() {
  return (
    <>
      {/* NAVBAR */}
      <OwnerNavBar />

      {/* PAGE WRAPPER */}
      <div className="h-screen bg-[#FFF9E8] overflow-hidden flex flex-col">

        {/* MAIN CONTENT */}
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-xs bg-white rounded-xl shadow border border-[#F1E3B3] p-5 mt-6"> {/* <-- mt-6 adds gap */}

            {/* BRAND */}
            <div className="text-center mb-">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-lg font-bold shadow">
                SC
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-3">
                Owner Login
              </h2>
              <p className="text-xs text-gray-500">
                Wash center access
              </p>
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                placeholder="owner@sparklewash.com"
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button className="w-full bg-[#D4AF37] text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition">
              Login
            </button>

            {/* SUB TEXT */}
            <p className="text-[11px] text-center text-gray-500 mt-3">
              Authorized owners only
            </p>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="w-full text-center text-sm text-gray-600 py-3 bg-gray-100">
          © {new Date().getFullYear()} Sparkle Car Wash
        </footer>
      </div>
    </>
  );
}
