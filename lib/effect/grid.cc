#include "grid.h"
#include "device.pb.h"

Grid::Grid() : Effect() {}

//static
devicepackage::DisplayPositions Grid::GetPositionsForDisplay(
      int rows, int columns, 
      devicepackage::Dimension row_spacing,
      devicepackage::Dimension column_spacing) {
  devicepackage::DisplayPositions result;
  float rowMM = ConvertToMM(row_spacing);
  float colMM = ConvertToMM(column_spacing);
  for (int i=0; i<rows; i++) {
    for (int j=0; j<columns; j++) {
      devicepackage::Position* p = result.add_positions();
      p->set_x(i*rowMM);
      p->set_y(j*colMM);
    }
  }
  return result;
};