import * as Utils from '../utils'

describe('Utils', () => {

  describe('random', () => {
    it('should return a number between 0 and 1 when no range specified', () => {
      const random = Utils.random()

      expect(random >= 0).toBe(true)
      expect(random < 1).toBe(true)
    })

    it('should return a number higher or equal than min', () => {
      const min = 106
      const random = Utils.random(min)

      expect(random >= min).toBe(true)
    })

    it('should return a number lower or equal than max', () => {
      const max = 106
      const random = Utils.random(null, max)

      expect(random <= max).toBe(true)
    })

    const ranges = [
      [0,1],[106,107],[100,700],[0,1000],[10000,20000]
    ]
    ranges.forEach((range) => {
      it('should return a number in the specified range', () => {
        const min = range[0]
        const max = range[1]
        const random = Utils.random(min, max)

        expect(random >= min).toBe(true)
        expect(random <= max).toBe(true)
      })
    })

  })

})
