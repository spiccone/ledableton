
#include <iostream>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

using Server = websocketpp::server<websocketpp::config::asio>;

void on_message(Server* s, websocketpp::connection_hdl hdl,
                Server::message_ptr msg) {
  std::cout << "on_message called with hdl: " << hdl.lock().get()
            << " and message: " << msg->get_payload() << std::endl;

  // check for a special command to instruct the server to stop listening so
  // it can be cleanly exited.
  if (msg->get_payload() == "stop-listening") {
    s->stop_listening();
    return;
  }

  try {
    s->send(hdl, msg->get_payload(), msg->get_opcode());
  } catch (websocketpp::exception const& e) {
    std::cout << "Echo failed because: "
              << "(" << e.what() << ")" << std::endl;
  }
}

int main(int argc, char* argv[]) {
  Server server;
  server.init_asio();
  server.set_message_handler(websocketpp::lib::bind(
      &on_message, &server, websocketpp::lib::placeholders::_1,
      websocketpp::lib::placeholders::_2));
  server.listen(9001);
  server.start_accept();
  server.run();

  return 0;
}
