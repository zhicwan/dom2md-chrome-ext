chrome.devtools.panels.elements.createSidebarPane(
  'Markdown',
  (sidebar: chrome.devtools.panels.ExtensionSidebarPane) => {
    sidebar.setPage('sidebar.html');
  },
);
