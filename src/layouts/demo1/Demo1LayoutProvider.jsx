/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useMenuChildren } from "@/components/menu";
import { MENU_SIDEBAR } from "@/config/menu.config";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useMenus } from "@/providers";
import { useLayout } from "@/providers";
import { deepMerge } from "@/utils";
import { demo1LayoutConfig } from "./";
import axios from "axios";

// Interface defining the structure for layout provider properties

// Initial layout properties with default values
const initalLayoutProps = {
  layout: demo1LayoutConfig,
  // Default layout configuration
  megaMenuEnabled: false,
  // Mega menu disabled by default
  headerSticky: false,
  // Header is not sticky by default
  mobileSidebarOpen: false,
  // Mobile sidebar is closed by default
  mobileMegaMenuOpen: false,
  // Mobile mega menu is closed by default
  sidebarMouseLeave: false,
  // Sidebar mouse leave is false initially
  setSidebarMouseLeave: (state) => {
    console.log(`${state}`);
  },
  setMobileMegaMenuOpen: (open) => {
    console.log(`${open}`);
  },
  setMobileSidebarOpen: (open) => {
    console.log(`${open}`);
  },
  setMegaMenuEnabled: (enabled) => {
    console.log(`${enabled}`);
  },
  setSidebarCollapse: (collapse) => {
    console.log(`${collapse}`);
  },
  setSidebarTheme: (mode) => {
    console.log(`${mode}`);
  },
};

// Creating context for the layout provider with initial properties
const Demo1LayoutContext = createContext(initalLayoutProps);

// Custom hook to access the layout context
const useDemo1Layout = () => useContext(Demo1LayoutContext);

// Layout provider component that wraps the application
const Demo1LayoutProvider = ({ children }) => {
  const [menuReady, setMenuReady] = useState(false);
  const { pathname } = useLocation(); // Gets the current path
  const { setMenuConfig } = useMenus(); // Accesses menu configuration methods
  const secondaryMenu = useMenuChildren(pathname, MENU_SIDEBAR, 0); // Retrieves the secondary menu

  // setMenuConfig("primary", MENU_SIDEBAR);
  // setMenuConfig("secondary", secondaryMenu);
  const { getLayout, updateLayout, setCurrentLayout } = useLayout(); // Layout management methods

  // Убираем permissions: всегда показываем все меню
  useEffect(() => {
    setMenuConfig("primary", MENU_SIDEBAR);
    setMenuConfig("secondary", useMenuChildren(pathname, MENU_SIDEBAR, 0));
    setMenuReady(true);
  }, [pathname]);

  // Merges the default layout with the current one
  const getLayoutConfig = () => {
    return deepMerge(demo1LayoutConfig, getLayout(demo1LayoutConfig.name));
  };
  const [layout, setLayout] = useState(getLayoutConfig); // State for layout configuration

  // Updates the current layout when the layout state changes
  useEffect(() => {
    setCurrentLayout(layout);
  });
  const [megaMenuEnabled, setMegaMenuEnabled] = useState(false); // State for mega menu toggle

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // State for mobile sidebar

  const [mobileMegaMenuOpen, setMobileMegaMenuOpen] = useState(false); // State for mobile mega menu

  const [sidebarMouseLeave, setSidebarMouseLeave] = useState(false); // State for sidebar mouse leave

  const scrollPosition = useScrollPosition(); // Tracks the scroll position

  const headerSticky = scrollPosition > 0; // Makes the header sticky based on scroll

  // Function to collapse or expand the sidebar
  const setSidebarCollapse = (collapse) => {
    const updatedLayout = {
      options: {
        sidebar: {
          collapse,
        },
      },
    };
    updateLayout(demo1LayoutConfig.name, updatedLayout); // Updates the layout with the collapsed state
    setLayout(getLayoutConfig()); // Refreshes the layout configuration
  };

  // Function to set the sidebar theme (e.g., light or dark)
  const setSidebarTheme = (mode) => {
    const updatedLayout = {
      options: {
        sidebar: {
          theme: mode,
        },
      },
    };
    setLayout(deepMerge(layout, updatedLayout)); // Merges and sets the updated layout
  };
  return (
    // Provides the layout configuration and controls via context to the application
    <Demo1LayoutContext.Provider
      value={{
        layout,
        headerSticky,
        mobileSidebarOpen,
        mobileMegaMenuOpen,
        megaMenuEnabled,
        sidebarMouseLeave,
        setMobileSidebarOpen,
        setMegaMenuEnabled,
        setSidebarMouseLeave,
        setMobileMegaMenuOpen,
        setSidebarCollapse,
        setSidebarTheme,
      }}
    >
      {menuReady ? children : null}
    </Demo1LayoutContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { Demo1LayoutProvider, useDemo1Layout };
