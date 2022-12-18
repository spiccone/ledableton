#include "strip.h"
#include "device.pb.h"

Strip::Strip() : Effect() {}

//static
devicepackage::DisplayPositions Strip::GetPositionsForDisplay(int leds, devicepackage::Dimension spacing) {
  devicepackage::DisplayPositions result;
  float spacingMM = ConvertToMM(spacing);
  for (int i=0; i<leds; i++) {
    devicepackage::Position* p = result.add_positions();
    p->set_x(i*spacingMM);
    p->set_y(0);
  }

  return result;
};