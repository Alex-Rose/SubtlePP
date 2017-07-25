// Settings is used to store options on the user's environment
// All settings are used in memory and should be persisted to disk
// with save function

const fs = require('fs');
const path = require('path');

let instance;

Settings = function() {
    instance = this;
    this.filename = '.settings';
    this.properties = {
        disableColors: false,
        preventMessageFlicker: false,
        desktopNotifications: false,
        showTimestamps: false,
        useCustomNicknames: true,
        timestampLocale: "en-US",
        timestampOptions: {},
        logonTimeout: 43200000 // 12hrs in ms
    };
};

// Get singleton instance
Settings.getInstance = function (){
  if (instance === undefined) {
    instance = new Settings();
  }
  return instance;
};

// Save the current properties dictionary on disk
Settings.prototype.save = function(){
  var settings = this;
  var savePath = path.resolve(__dirname, '../', settings.filename);
  fs.writeFile(savePath, JSON.stringify(settings.properties, null, '  '), (err, res) => {
    if (!err) {
      console.log('Settings have been saved'); 
    } else {
      console.log('Error saving .settings file');
    }
  });
};

// Load previously saved properties from disk
// callback(error, properties), where properties is a dictionary
Settings.prototype.load = function(callback){
    var settings = this;

    fs.readFile(path.resolve(__dirname, '../', settings.filename), function (err, data) {
        if (!err) {
            try {
                settings.properties = JSON.parse(data.toString());
            } catch (except) {
                err = except;
          }
        }
        if (err) {
            console.log('Warning : settings not found, lets try to create default'.yellow);
            try {
                settings.save();
                err = undefined;
            } catch (Exception) {
                err = Exception;
            }
        }
        callback(err, settings.properties);
    });
};

// Delete properties from disk and wipe dictionary in memory
Settings.prototype.flush = function() {
  var settings = this;
  fs.unlink(settings.filename);
  settings.properties = {};
};

Settings.prototype.getLogonTimeout = function () {
  var settings = this;

  if (settings.properties.logonTimeout === undefined) {
    settings.properties.logonTimeout = 43200000; // 12hrs in ms
    settings.save();
  }

  return settings.properties.logonTimeout;
}

module.exports = Settings;
