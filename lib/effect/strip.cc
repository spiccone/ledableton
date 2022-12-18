#include "strip.h"
#include "device.pb.h"

Strip::Strip() : Effect() {}

static std::vector<devicepackage::Position> GetPositionsForDisplay(int leds) {
  const int SIZE = 1000;

  std::vector<devicepackage::Position> result;
  // for (int i=0; i<leds; i++) {
  //   result.emplace_back();
  // }

  return result;
};