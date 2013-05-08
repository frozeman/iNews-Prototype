Package.describe({
  summary: "To let the iNews modules communicate"
});

Package.on_use(function (api) {
  api.add_files(['mediator.js'], ['server','client']);
});