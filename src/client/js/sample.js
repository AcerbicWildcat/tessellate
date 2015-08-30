var AppClient = function() {
  this.name = "Panda";
};
AppClient.prototype.setName = function(name) {
  this.name = name;
};
AppClient.prototype.getName = function() {
  return this.name;
};