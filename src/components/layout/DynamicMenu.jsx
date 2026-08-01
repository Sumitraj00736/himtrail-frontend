import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const HOVER_CLOSE_DELAY = 450;
const MEGA_COLS_PER_ROW = 4;

const chunk = (arr, size) => {
  const rows = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
};

const ColumnTitle = ({ title, compact = false }) => (
  <div className={`flex items-center gap-2 ${compact ? "mb-2" : "mb-2.5"}`}>
    <span className="w-0.5 h-3.5 rounded-full bg-brand flex-shrink-0" />
    <p
      className={`font-bold uppercase tracking-wide text-brand leading-none ${
        compact ? "text-[10px]" : "text-[11px]"
      }`}
    >
      {title}
    </p>
  </div>
);

const MenuLink = ({ item, onClick, variant = "default" }) => {
  if (variant === "mega") {
    return (
      <Link
        to={item.href || "#"}
        onClick={onClick}
        className="block py-1 text-[12.5px] leading-snug text-slate-600 hover:text-brand transition-colors duration-150 break-words"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      to={item.href || "#"}
      onClick={onClick}
      className={`group/link flex items-center gap-2 rounded-lg text-slate-600 hover:text-brand hover:bg-brand-50/60 transition-all duration-150 ${
        variant === "compact"
          ? "px-2.5 py-1.5 text-[13px]"
          : "px-3 py-2 text-sm"
      }`}
    >
      <span className="flex-1 leading-snug">{item.label}</span>
      <FontAwesomeIcon
        icon={faChevronRight}
        className="w-2 h-2 opacity-0 -translate-x-1 group-hover/link:opacity-50 group-hover/link:translate-x-0 transition-all duration-150 text-brand"
      />
    </Link>
  );
};

const ColumnLinks = ({ items, variant = "default", onItemClick }) => (
  <ul className={variant === "mega" ? "space-y-0" : "space-y-0.5"}>
    {items.map((item) => (
      <li key={`${item.label}-${item.href || item.tripId}`}>
        <MenuLink item={item} variant={variant} onClick={onItemClick} />
      </li>
    ))}
  </ul>
);

const MegaMenuColumn = ({ col, onItemClick }) => (
  <div className="min-w-0 px-4 first:pl-0">
    <ColumnTitle title={col.title} />
    <ColumnLinks items={col.items} variant="mega" onItemClick={onItemClick} />
  </div>
);

const MegaMenuPanel = ({ menu, onItemClick }) => {
  const rows = chunk(menu.columns, MEGA_COLS_PER_ROW);

  return (
    <div
      className="divide-y divide-slate-100"
      style={{ maxHeight: "min(68vh, 520px)", overflowY: "auto" }}
    >
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid divide-x divide-slate-100 px-5 py-4 lg:px-6 lg:py-5"
          style={{
            gridTemplateColumns: `repeat(${MEGA_COLS_PER_ROW}, minmax(0, 1fr))`,
          }}
        >
          {row.map((col) => (
            <MegaMenuColumn
              key={col.title}
              col={col}
              onItemClick={onItemClick}
            />
          ))}
          {row.length < MEGA_COLS_PER_ROW &&
            Array.from({ length: MEGA_COLS_PER_ROW - row.length }).map(
              (_, i) => <div key={`empty-${i}`} aria-hidden="true" />,
            )}
        </div>
      ))}
    </div>
  );
};

const DynamicMenu = () => {
  const [menus, setMenus] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [navPortal, setNavPortal] = useState(null);
  const closeTimer = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    api.get("/content/menus").then((res) => {
      setMenus(res.data.data || []);
    });
  }, []);

  useEffect(() => {
    setNavPortal(document.querySelector("[data-main-nav]"));
  }, []);

  const openMenu = (menuId) => {
    clearTimeout(closeTimer.current);
    setActiveMenuId(menuId);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(
      () => setActiveMenuId(null),
      HOVER_CLOSE_DELAY,
    );
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const closeMobile = () => setMobileOpen(false);
  const activeMenu = menus.find((m) => m._id === activeMenuId);
  const activeMega = activeMenu?.style === "mega" ? activeMenu : null;

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="xl:hidden flex items-center">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="relative w-10 h-10 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-brand/20 hover:bg-brand-50/30 transition-all duration-200 z-50 flex items-center justify-center text-brand"
        >
          <FontAwesomeIcon
            icon={mobileOpen ? faXmark : faBars}
            className="w-4 h-4 transition-transform duration-200"
          />
        </button>
      </div>

      {/* Desktop Menu */}
      <nav ref={navRef} className="hidden xl:flex items-center gap-1 text-sm">
        {menus.map((menu) => {
          const isActive = activeMenuId === menu._id;
          return (
            <div
              key={menu._id}
              className="relative"
              onMouseEnter={() => openMenu(menu._id)}
              onMouseLeave={scheduleClose}
            >
              <button
                className={`relative flex items-center gap-1.5 px-3 py-2.5 font-semibold transition-colors duration-200 ${
                  isActive ? "text-brand" : "text-slate-700 hover:text-brand"
                }`}
              >
                {menu.label}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-2.5 h-2.5 transition-all duration-300 ${
                    isActive ? "text-brand rotate-180" : "text-slate-400"
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-3 right-3 h-0.5 bg-brand transition-transform duration-300 origin-left rounded-full ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>

              {menu.style === "list" && isActive && (
                <div className="absolute left-0 top-full z-50">
                  <div className="bg-white rounded-b-xl shadow-premium-hover border border-t-0 border-slate-200/80 overflow-hidden w-80">
                    <div className="p-5">
                      {menu.columns.map((col, colIdx) => (
                        <div
                          key={col.title}
                          className={
                            colIdx > 0
                              ? "mt-5 pt-5 border-t border-slate-100"
                              : ""
                          }
                        >
                          <ColumnTitle title={col.title} />
                          <ColumnLinks
                            items={col.items}
                            onItemClick={() => setActiveMenuId(null)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Mega menu — portaled directly under main nav bar (zero gap) */}
      {navPortal &&
        createPortal(
          <AnimatePresence>
            {activeMega && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="hidden xl:block absolute left-0 right-0 top-full z-40 bg-white shadow-premium-hover border-b border-slate-200/80"
                onMouseEnter={() => openMenu(activeMega._id)}
                onMouseLeave={scheduleClose}
              >
                <div className="max-w-7xl mx-auto px-6">
                  <MegaMenuPanel
                    menu={activeMega}
                    onItemClick={() => setActiveMenuId(null)}
                  />{" "}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          navPortal,
        )}

      {/* Mobile Side Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="xl:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm z-[9998]"
              onClick={closeMobile}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[min(320px,85vw)] bg-white shadow-2xl z-[9999] overflow-y-auto flex flex-col"
              style={{ height: "100dvh" }}
            >
              <div className="sticky top-0 z-10 bg-premium-gradient text-white px-5 py-5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
                    Explore
                  </p>
                  <h2 className="text-lg font-display font-semibold">
                    Navigation
                  </h2>
                </div>
                <button
                  onClick={closeMobile}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4">
                {menus.map((menu, index) => (
                  <div
                    key={menu._id}
                    className="mb-2 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/50"
                  >
                    <button
                      onClick={() => toggleExpand(index)}
                      className="w-full px-4 py-3.5 flex justify-between items-center font-semibold text-forest-800 hover:bg-white transition-colors duration-200"
                    >
                      <span>{menu.label}</span>
                      <span
                        className={`w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center transition-transform duration-300 ${
                          expandedIndex === index
                            ? "rotate-180 bg-brand-50 border-brand/20"
                            : ""
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`w-3 h-3 ${expandedIndex === index ? "text-brand" : "text-slate-400"}`}
                        />
                      </span>
                    </button>

                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1 bg-white border-t border-slate-100">
                            {menu.columns.map((col, colIdx) => (
                              <div
                                key={col.title}
                                className={
                                  colIdx > 0
                                    ? "mt-4 pt-4 border-t border-slate-50"
                                    : ""
                                }
                              >
                                <ColumnTitle title={col.title} compact />
                                <ColumnLinks
                                  items={col.items}
                                  variant="compact"
                                />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="h-0.5 bg-brand flex-shrink-0" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DynamicMenu;
