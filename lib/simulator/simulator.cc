
#include <google/protobuf/util/json_util.h>

#include <fstream>
#include <iostream>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

#include "device.pb.h"
#include "strip.h"

using Server = websocketpp::server<websocketpp::config::asio>;

namespace ledableton {

using google::protobuf::util::JsonOptions;
using google::protobuf::util::JsonParseOptions;
using google::protobuf::util::MessageToJsonString;
using google::protobuf::util::JsonStringToMessage;

void on_message(Server *s, websocketpp::connection_hdl hdl,
                Server::message_ptr msg) {
  std::cout << "on_message called with hdl: " << hdl.lock().get()
            << " and message: " << msg->get_payload() << std::endl;

  // check for a special command to instruct the server to stop listening so
  // it can be cleanly exited.
  if (msg->get_payload() == "stop-listening") {
    s->stop_listening();
    return;
  }

  if (msg->get_payload() == "load-files") {
    std::cout << "Load";
    std::ifstream file;
    file.open("devices.json");
    std::string string;
    std::string sTotal;
    if (file.is_open()) {
      while(!file.eof()) {
        getline(file, string);
        sTotal += string + "\n";
      }
    } else {
      std::cout << "Unable to open devices.json";
    }
    try {
      s->send(hdl, sTotal, msg->get_opcode());
    } catch (websocketpp::exception const &e)  {
      std::cout << "Echo failed because: "
              << "(" << e.what() << ")" << std::endl;
    }
    return;
  }

  if ((msg->get_payload()).substr(2,7) == "devices") {
    std::ofstream file;
    file.open("devices.json");
    if (file.is_open()) {
      file << msg->get_payload() << std::endl;
      file.close();
    } else {
      std::cout << "Unable to open devices.json";
    }
    return;
  }

  if ((msg->get_payload()).substr(0,11) == "getPosition") {
    std::cout << "Get Position";
    try {
      devicepackage::Settings settings;
      google::protobuf::util::JsonParseOptions options;  
      JsonStringToMessage(msg->get_payload().substr(11), &settings, options);
      if(settings.has_strip()) {
        std::cout << "Strip" << std::endl;  
        devicepackage::DisplayPositions positions =
          Strip::GetPositionsForDisplay(settings.mutable_strip()->leds(), settings.mutable_strip()->spacing());
        std::string messageJson;
        JsonOptions options;
        MessageToJsonString(positions, &messageJson, options);
        s->send(hdl, messageJson, msg->get_opcode());
      }
    } catch (websocketpp::exception const &e) {
      std::cout << "Echo failed because: "
                << "(" << e.what() << ")" << std::endl;
    }
    return;
  }

  try {
    devicepackage::SavedDevices savedDevices;
    google::protobuf::util::JsonParseOptions options;  
    JsonStringToMessage(msg->get_payload(), &savedDevices, options);
    for(int i = 0; i < savedDevices.devices_size(); i++)
    std::cout << "Device: " << savedDevices.devices(i).name() << std::endl;
  } catch (websocketpp::exception const &e) {
    std::cout << "Echo failed because: "
              << "(" << e.what() << ")" << std::endl;
  }
}

}  // namespace ledableton

int main(int argc, char *argv[]) {
  Server server;
  server.init_asio();
  server.set_message_handler(websocketpp::lib::bind(
      &ledableton::on_message, &server, websocketpp::lib::placeholders::_1,
      websocketpp::lib::placeholders::_2));
  server.listen(9001);
  server.start_accept();
  server.run();

  return 0;
}
