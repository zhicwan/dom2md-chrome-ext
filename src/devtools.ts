chrome.devtools.panels.elements.createSidebarPane(
  'DOM → MD',
  (sidebar: chrome.devtools.panels.ExtensionSidebarPane) => {
    sidebar.setPage('sidebar.html');
  },
);
