
#include <google/protobuf/util/json_util.h>

#include <iostream>
#include <fstream>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

#include "device.pb.h"

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

  std::ofstream myfile;
  myfile.open("devices.json");
  if (myfile.is_open()) {
    myfile << msg->get_payload() << std::endl;
    myfile.close();
  } else {
    std::cout << "Unable to open file";
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

  // try {
  //   // s->send(hdl, msg->get_payload(), msg->get_opcode());
  //   std::string messageJson;
  //   JsonOptions options;
  //   MessageToJsonString(devices, &messageJson, options);
  //   std::cout << "Devices" << messageJson;
  //   s->send(hdl, messageJson, msg->get_opcode());
  // } catch (websocketpp::exception const &e) {
  //   std::cout << "Echo failed because: "
  //             << "(" << e.what() << ")" << std::endl;
  // }
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
