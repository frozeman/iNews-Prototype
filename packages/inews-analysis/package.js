Package.describe({
  summary: "The data analysis package for iNews"
});

Npm.depends({"calais": "0.1.5"});

Package.on_use(function (api) {
  api.add_files(['analysis.js'], 'server');
});