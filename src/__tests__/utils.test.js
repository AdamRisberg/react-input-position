import utils from "../utils";

describe("prevent default", () => {
  it("calls preventDefault on event", () => {
    const mockEvent = { preventDefault: jest.fn() };
    utils.preventDefault(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});

describe("convert range", () => {
  it("converts number to equivalent in new range", () => {
    expect(utils.convertRange(0, 10, 100, 200, 5)).toBe(150);
    expect(utils.convertRange(0, 50, 50, 100, 5)).toBe(55);
  });
});

describe("limit position", () => {
  const position = { x: 5, y: 5 };

  it("doesn't change valid position", () => {
    expect(utils.limitPosition(0, 10, 0, 10, position)).toEqual(position);
  });

  it("limits X to max", () => {
    expect(utils.limitPosition(0, 4, 0, 10, position)).toEqual({ x: 4, y: 5 });
  });

  it("limits X to min", () => {
    expect(utils.limitPosition(6, 10, 0, 10, position)).toEqual({ x: 6, y: 5 });
  });

  it("limits Y to min", () => {
    expect(utils.limitPosition(0, 10, 0, 4, position)).toEqual({ x: 5, y: 4 });
  });

  it("limits Y to max", () => {
    expect(utils.limitPosition(0, 10, 6, 10, position)).toEqual({ x: 5, y: 6 });
  });
});

describe("create adjusted limits", () => {
  const elemDimensions = { width: 100, height: 100 };
  const smallItemDimensions = { width: 50, height: 50 };
  const bigItemDimensions = { width: 150, height: 150 };

  it("doesn't adjust if not limited by size", () => {
    expect(
      utils.createAdjustedLimits(
        0,
        10,
        0,
        10,
        elemDimensions,
        bigItemDimensions,
        false,
        false
      )
    ).toEqual({ minX: 0, maxX: 10, minY: 0, maxY: 10 });
  });

  it("uses element dimensions with negative max limits", () => {
    expect(
      utils.createAdjustedLimits(
        0,
        -10,
        0,
        -10,
        elemDimensions,
        bigItemDimensions,
        false,
        false
      )
    ).toEqual({ minX: 0, maxX: 90, minY: 0, maxY: 90 });
  });

  it("limits by size", () => {
    expect(
      utils.createAdjustedLimits(
        0,
        0,
        0,
        0,
        elemDimensions,
        bigItemDimensions,
        true,
        false
      )
    ).toEqual({ minX: -50, maxX: 0, minY: -50, maxY: 0 });
  });

  it("limits by size using undefined itemDimensions", () => {
    expect(
      utils.createAdjustedLimits(0, 0, 0, 0, elemDimensions, {}, true, false)
    ).toEqual({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  });

  it("limits by size - internal", () => {
    expect(
      utils.createAdjustedLimits(
        0,
        0,
        0,
        0,
        elemDimensions,
        smallItemDimensions,
        true,
        true
      )
    ).toEqual({ minX: 0, maxX: 50, minY: 0, maxY: 50 });
  });

  it("returns zeroed position when limiting by invalid size", () => {
    expect(
      utils.createAdjustedLimits(
        0,
        0,
        0,
        0,
        elemDimensions,
        smallItemDimensions,
        true,
        false
      )
    ).toEqual({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  });

  it("returns zeroed position when limiting by invalid size - internal", () => {
    expect(
      utils.createAdjustedLimits(
        0,
        0,
        0,
        0,
        elemDimensions,
        bigItemDimensions,
        true,
        true
      )
    ).toEqual({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  });
});

describe("calculate item position", () => {
  const itemPosition = { x: 50, y: 50 };
  const activePosition = { x: 75, y: 75 };
  const prevActivePosition = { x: 80, y: 90 };

  it("calculates position with 1x multiplier", () => {
    expect(
      utils.calculateItemPosition(
        itemPosition,
        prevActivePosition,
        activePosition,
        1
      )
    ).toEqual({ x: 45, y: 35 });
  });

  it("calculates position with 2x multiplier", () => {
    expect(
      utils.calculateItemPosition(
        itemPosition,
        prevActivePosition,
        activePosition,
        2
      )
    ).toEqual({ x: 40, y: 20 });
  });
});

describe("align item on position", () => {
  const elementDimensions = { width: 100, height: 100 };
  const itemDimensions = { width: 300, height: 300 };
  const position = { x: 20, y: 20 };

  it("aligns item based on cursor position", () => {
    expect(
      utils.alignItemOnPosition(elementDimensions, itemDimensions, position)
    ).toEqual({ x: -40, y: -40 });
  });

  it("handles undefined item dimensions", () => {
    expect(utils.alignItemOnPosition(elementDimensions, {}, position)).toEqual({
      x: 20,
      y: 20
    });
  });
});

describe("center item on position", () => {
  const elementDimensions = { width: 100, height: 100 };
  const itemDimensions = { width: 300, height: 300 };
  const position = { x: 20, y: 20 };

  it("centers specific spot on item within element based on cursor position", () => {
    expect(
      utils.centerItemOnPosition(elementDimensions, itemDimensions, position)
    ).toEqual({ x: -10, y: -10 });
  });
});
