cmake_minimum_required(VERSION 3.11)
project(colordance-circle LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED On)
set(CMAKE_CXX_EXTENSIONS Off)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/cmake)
list(APPEND CMAKE_MODULE_PATH
     ${CMAKE_CURRENT_SOURCE_DIR}/cmake/cmake-fetch-content)

# Generate the file needed for YCM integration
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(FetchContent)
include(fetch-content-shim)
include(ExternalProject)

find_package(Boost REQUIRED)

FetchContent_Declare(
  fake-fast-led
  GIT_REPOSITORY https://github.com/ademuri/FakeFastLED.git
  GIT_TAG master)
FetchContent_MakeAvailable(fake-fast-led)

FetchContent_Declare(
  websocketpp
  GIT_REPOSITORY https://github.com/zaphoyd/websocketpp.git
  GIT_TAG 0.8.2)
FetchContent_MakeAvailable(websocketpp)

find_package(Protobuf REQUIRED)

# Set appropriate warning levels and include debug symbols.
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -pedantic -g")

file(GLOB LIBRARY_SOURCES "lib/effect/*.cc" "lib/led-manager/*.cc")
add_library(generic ${LIBRARY_SOURCES})
target_link_libraries(generic fake-fast-led)

target_include_directories(
  generic
  PUBLIC $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/lib/effect>
         $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/lib/led-manager>
         $<INSTALL_INTERFACE:lib/effect>)

# ???
add_library(websocketpp INTERFACE)
target_include_directories(
  websocketpp INTERFACE $<BUILD_INTERFACE:${WEBSOCKETPP_SOURCE_DIR}>
                        $<INSTALL_INTERFACE:include>)
target_link_libraries(websocketpp INTERFACE Boost::boost)
install(
  TARGETS websocketpp
  EXPORT websocketpp-config
  DESTINATION include)
install(EXPORT websocketpp-config DESTINATION share/websocketpp/cmake)

include_directories(${CMAKE_CURRENT_BINARY_DIR})
protobuf_generate_cpp(PROTO_SRCS PROTO_HDRS proto/device.proto)
file(GLOB SIMULATOR_SOURCES "lib/simulator/*.cc")
add_executable(simulator ${SIMULATOR_SOURCES} ${PROTO_SRCS} ${PROTO_HDRS})
target_link_libraries(simulator generic websocketpp ${PROTOBUF_LIBRARY}
                      ${Protobuf_LIBRARIES})

target_include_directories(simulator
                           PUBLIC $<BUILD_INTERFACE:${websocketpp_SOURCE_DIR}>)
