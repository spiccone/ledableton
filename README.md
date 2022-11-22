# ledabelton

App to create led shows to music.

## Building

This project uses CMake. It uses [websocketpp](https://github.com/zaphoyd/websocketpp) as a websocket server. To build and run:

```
mkdir build
cd build
cmake ..
make -j3 && ./simulator
```

By default, this starts the server listening on localhost:9001.
