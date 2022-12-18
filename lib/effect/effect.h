#pragma once

#include "device.pb.h"

class Effect {
  public:
    Effect();
    virtual ~Effect(){};

    static float ConvertToMM(devicepackage::Dimension dimension) {
      float factor = 1;
      if (dimension.has_unit() && dimension.unit() == 1) {
        factor = 25.4;
      }
      return dimension.dimension() * factor;
    }
};
