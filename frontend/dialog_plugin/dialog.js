var DialogSpawner,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

$(document).ready(function() {
  console.log("trying");
  return $(".dialog-spawner").each(function() {
    var foo;
    return foo = new DialogSpawner(this);
  });
});

DialogSpawner = (function(_super) {

  __extends(DialogSpawner, _super);

  function DialogSpawner(div) {
    this.div = div;
    DialogSpawner.__super__.constructor.call(this, "dialogspawner");
    console.log("created dialog spawner");
  }

  DialogSpawner.prototype.handle_msg = function(data) {
    var answer, ok;
    if (data.type === "alert") {
      alert(data.text);
      this.send_msg_data(JSON.stringify({
        id: data.id
      }));
    }
    if (data.type === "confirm") {
      ok = confirm(data.text);
      this.send_msg_data(JSON.stringify({
        id: data.id,
        ok: ok
      }));
    }
    if (data.type === "prompt") {
      answer = prompt(data.text, data.default_value);
      return this.send_msg_data(JSON.stringify({
        id: data.id,
        answer: answer
      }));
    } else {
      return console.log("unknown data", data);
    }
  };

  return DialogSpawner;

})(PluginAdapter);
