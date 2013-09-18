# encoding: utf-8
require_relative './plugin.rb'

require 'thread/promise'
require 'monitor'

require 'json'

class DialogSpawnerPlugin < Schem::Plugin
  include MonitorMixin
  def initialize(*args)
    super
    @waiting = {}
    @id = 1
  end

  def get_id
    synchronize do
      return @id+=1
    end
  end

  def display_dialog(diag)
    synchronize do
      diag['id'] = get_id
      promise = Thread.promise
      @waiting[diag['id']] = promise
      @socket.write(JSON.dump(diag))
      return promise
    end
  end

  def wait_for_values
    loop do
        line = @socket.read()
      begin
        json = JSON.parse(line)
        raise "expected an id in #{line.inspect}" unless json['id']
        @waiting[json['id']] << json
        @waiting.delete json['id']
      rescue
        Schem::Log.error("plugins:dialog:exception","in parsing #{line}\n#{Schem::Log.trace}")
      end
    end
  end

  def web_run(socket)
    srv.dialog.register_spawner(self)
    @socket = socket
    wait_for_values
  end

  def stop
    @socket.close
  end
end
# If you would like to run the plugin uncomment the next line
register_plugin(DialogSpawnerPlugin)
