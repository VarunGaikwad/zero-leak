import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { MENU } from "@zeroleak/package/web/constant";
import { Provider } from "./model";

const MOBILE_VISIBLE = 3;

export default function Dashboard() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [overflowOpen, setOverflowOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const date = new Date();
    const timeoutId = setTimeout(
      () => {
        tick();
        intervalRef.current = setInterval(tick, 60 * 1000);
      },
      (60 - date.getSeconds()) * 1000,
    );
    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const displayHours = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const dayName = now
    .toLocaleDateString("en-US", { dateStyle: "full" })
    .split(",")[0];
  const dateStr = now.toLocaleDateString("en-US", { dateStyle: "long" });

  const visibleMenu = MENU.slice(0, MOBILE_VISIBLE);
  const overflowMenu = MENU.slice(MOBILE_VISIBLE);

  return (
    <Provider>
      <div className="flex flex-col md:flex-row h-svh w-screen bg-white text-black">
        <aside className="hidden md:flex lg:hidden flex-col p-2 space-y-5 border-r w-14 shrink-0">

          <div className="space-y-2 mt-4">
            {MENU.map(({ Icon, title, link }) => (
              <NavLink
                to={link}
                key={title}
                title={title}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-black text-white rounded-full"
                      : "hover:bg-gray-100 hover:rounded-full"
                  } w-10 h-10 flex items-center justify-center mx-auto transition-all duration-300`
                }
              >
                <Icon size={18} className="shrink-0" />
              </NavLink>
            ))}
          </div>
        </aside>

        <aside
          className={`hidden lg:flex p-2 space-y-5 border-r ${
            menuIsOpen ? "w-1/6" : "w-14"
          } transition-all duration-500 shrink-0 flex-col`}
        >
          <div
            className={
              menuIsOpen ? "flex justify-end" : "w-full flex justify-center"
            }
          >
            {menuIsOpen ? (
              <ChevronLeft
                className="cursor-pointer"
                onClick={() => setMenuIsOpen(false)}
              />
            ) : (
              <ChevronRight
                className="cursor-pointer"
                onClick={() => setMenuIsOpen(true)}
              />
            )}
          </div>

          {menuIsOpen && (
            <div className="text-center font-extrabold text-black">
              <div className="text-4xl tracking-wide">
                {displayHours}:{displayMinutes}
                <span className="text-xl"> {ampm}</span>
              </div>
              <div className="">{dayName}</div>
              <div className="">{dateStr}</div>
            </div>
          )}

          <div className="space-y-2 mt-10">
            {MENU.map(({ Icon, title, link }) => (
              <NavLink
                to={link}
                key={title}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-black text-white rounded-full"
                      : "hover:bg-gray-100 hover:rounded-full"
                  } flex items-center transition-all duration-500 ${
                    menuIsOpen
                      ? "px-4 py-3"
                      : "w-10 h-10 justify-center mx-auto"
                  }`
                }
              >
                <Icon className="shrink-0" />
                {menuIsOpen && <span className="ml-2 truncate">{title}</span>}
              </NavLink>
            ))}
          </div>
        </aside>

        {/* divider — tablet + desktop only */}
        <div className="hidden md:block bg-gray-200 h-full w-0.5 rounded-full shrink-0" />

        {/* ── MAIN ── */}
        <main className="flex-1 overflow-auto bg-white text-black p-4 pb-20 md:pb-4">
          <Outlet />
        </main>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around px-2 py-2 z-50">
          {visibleMenu.map(({ Icon, title, link }) => (
            <NavLink
              to={link}
              key={title}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "bg-black text-white rounded-full"
                    : "text-black"
                } w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300`
              }
            >
              <Icon size={20} />
            </NavLink>
          ))}

          <div className="relative">
            <button
              onClick={() => setOverflowOpen(!overflowOpen)}
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
                overflowOpen
                  ? "bg-black text-white"
                  : "text-black"
              }`}
            >
              {overflowOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
            </button>

            {overflowOpen && (
              <div className="absolute bottom-14 right-0 bg-white border rounded-2xl p-2 space-y-1 min-w-40 shadow-lg z-50">
                {overflowMenu.map(({ Icon, title, link }) => (
                  <NavLink
                    to={link}
                    key={title}
                    onClick={() => setOverflowOpen(false)}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? "bg-black text-white"
                          : "hover:bg-gray-100 text-black"
                      } flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-300`
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="text-sm">{title}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </Provider>
  );
}
