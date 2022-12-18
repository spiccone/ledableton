#pragma once

#include "effect.h"
#include "device.pb.h"

class Strip : public Effect {
  public:
    Strip();

    static devicepackage::DisplayPositions GetPositionsForDisplay(int leds, devicepackage::Dimension spacing);
};
