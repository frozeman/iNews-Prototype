Package.describe({
  summary: "To search in the data clusters and news of iNews"
});

// Npm.depends({"q": "0.9.3"});

Package.on_use(function (api) {
  api.add_files(['search.js'], 'server');
});