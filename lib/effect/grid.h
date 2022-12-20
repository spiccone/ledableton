#pragma once

#include "effect.h"
#include "device.pb.h"

class Grid : public Effect {
  public:
    Grid();

    static devicepackage::DisplayPositions GetPositionsForDisplay(
      int rows, int columns, 
      devicepackage::Dimension row_spacing,
      devicepackage::Dimension column_spacing);
};
