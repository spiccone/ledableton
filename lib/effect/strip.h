#pragma once

#include "effect.h"
#include "device.pb.h"


class Strip : public Effect {
  public:
    Strip();

    // TODO: Change in spacing to dimemsion
    static std::vector<devicepackage::Position> GetPositionsForDisplay(int leds);
};
