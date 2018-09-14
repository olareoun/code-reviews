import { reallocate } from './matrix'

describe('Matrix', () => {
  describe('#reallocate', () => {
    const SAMPLES = [
      {
        when: 'reallocating prop row 1 place from an index',
        then: 'the upper rows are increased by 1',
        cells: [
          { row: 0, col: 0, value: '00' }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10' }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20' }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
        ],
        prop: 'row',
        index: 1,
        amount: 1,
        expected: [
          { row: 0, col: 0, value: '00' }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 2, col: 0, value: '10' }, { row: 2, col: 1, value: '11' }, { row: 2, col: 2, value: '12' },
          { row: 3, col: 0, value: '20' }, { row: 3, col: 1, value: '21' }, { row: 3, col: 2, value: '22' },
        ]
      },
      {
        when: 'reallocating prop row 2 places from an index',
        then: 'the upper rows are increased by 2',
        cells: [
          { row: 0, col: 0, value: '00' }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10' }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20' }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
        ],
        prop: 'row',
        index: 1,
        amount: 2,
        expected: [
          { row: 0, col: 0, value: '00' }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 3, col: 0, value: '10' }, { row: 3, col: 1, value: '11' }, { row: 3, col: 2, value: '12' },
          { row: 4, col: 0, value: '20' }, { row: 4, col: 1, value: '21' }, { row: 4, col: 2, value: '22' },
        ]
      },
      {
        when: 'reallocating prop row -1 place from an index',
        then: 'the upper rows are decreased by 1',
        cells: [
          { row: 0, col: 0, value: '00' }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10' }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20' }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
        ],
        prop: 'row',
        index: 1,
        amount: -1,
        expected: [
          { row: 0, col: 0, value: '00' }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '20' }, { row: 1, col: 1, value: '21' }, { row: 1, col: 2, value: '22' },
        ]
      },
      {
        when: 'reallocating prop col having a merged cell',
        then: 'merged area is also increased',
        cells: [
          { row: 0, col: 0, value: '00', rowspan: 1, colspan: 2 }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10'                         }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
        ],
        prop: 'col',
        index: 1,
        amount: 1,
        expected: [
          { row: 0, col: 0, value: '00', rowspan: 1, colspan: 3 }, { row: 0, col: 2, value: '01' }, { row: 0, col: 3, value: '02' },
          { row: 1, col: 0, value: '10'                         }, { row: 1, col: 2, value: '11' }, { row: 1, col: 3, value: '12' },
        ]
      },
      {
        when: 'removing all the rows that are part of a merged cell',
        then: 'merged area disappears',
        cells: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 2, colspan: 2 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20'                         }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
          { row: 3, col: 0, value: '30'                         }, { row: 3, col: 1, value: '31' }, { row: 3, col: 2, value: '32' },
          { row: 4, col: 0, value: '40'                         }, { row: 4, col: 1, value: '41' }, { row: 4, col: 2, value: '42' },
          { row: 5, col: 0, value: '50'                         }, { row: 5, col: 1, value: '51' }, { row: 5, col: 2, value: '52' },
        ],
        prop: 'row',
        index: 1,
        amount: -2,
        expected: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '30'                         }, { row: 1, col: 1, value: '31' }, { row: 1, col: 2, value: '32' },
          { row: 2, col: 0, value: '40'                         }, { row: 2, col: 1, value: '41' }, { row: 2, col: 2, value: '42' },
          { row: 3, col: 0, value: '50'                         }, { row: 3, col: 1, value: '51' }, { row: 3, col: 2, value: '52' },
        ]
      },
      {
        when: 'removing a row that is at the begining of a merged cell',
        then: 'merged area is reallocated',
        cells: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 3, colspan: 2 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20'                         }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
          { row: 3, col: 0, value: '30'                         }, { row: 3, col: 1, value: '31' }, { row: 3, col: 2, value: '32' },
          { row: 4, col: 0, value: '40'                         }, { row: 4, col: 1, value: '41' }, { row: 4, col: 2, value: '42' },
          { row: 5, col: 0, value: '50'                         }, { row: 5, col: 1, value: '51' }, { row: 5, col: 2, value: '52' },
        ],
        prop: 'row',
        index: 1,
        amount: -1,
        expected: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '20', rowspan: 2, colspan: 2 }, { row: 1, col: 1, value: '21' }, { row: 1, col: 2, value: '22' },
          { row: 2, col: 0, value: '30'                         }, { row: 2, col: 1, value: '31' }, { row: 2, col: 2, value: '32' },
          { row: 3, col: 0, value: '40'                         }, { row: 3, col: 1, value: '41' }, { row: 3, col: 2, value: '42' },
          { row: 4, col: 0, value: '50'                         }, { row: 4, col: 1, value: '51' }, { row: 4, col: 2, value: '52' },
        ]
      },
      {
        when: 'removing some rows all of them being at the begining of a merged cell',
        then: 'merged area is reallocated',
        cells: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 4, colspan: 2 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20'                         }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
          { row: 3, col: 0, value: '30'                         }, { row: 3, col: 1, value: '31' }, { row: 3, col: 2, value: '32' },
          { row: 4, col: 0, value: '40'                         }, { row: 4, col: 1, value: '41' }, { row: 4, col: 2, value: '42' },
          { row: 5, col: 0, value: '50'                         }, { row: 5, col: 1, value: '51' }, { row: 5, col: 2, value: '52' },
        ],
        prop: 'row',
        index: 1,
        amount: -2,
        expected: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '30', rowspan: 2, colspan: 2 }, { row: 1, col: 1, value: '31' }, { row: 1, col: 2, value: '32' },
          { row: 2, col: 0, value: '40'                         }, { row: 2, col: 1, value: '41' }, { row: 2, col: 2, value: '42' },
          { row: 3, col: 0, value: '50'                         }, { row: 3, col: 1, value: '51' }, { row: 3, col: 2, value: '52' },
        ]
      },
      {
        when: 'removing some rows one of them being at the begining of a merged cell',
        then: 'reallocates the merged area',
        cells: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 3, colspan: 2 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20'                         }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
          { row: 3, col: 0, value: '30'                         }, { row: 3, col: 1, value: '31' }, { row: 3, col: 2, value: '32' },
          { row: 4, col: 0, value: '40'                         }, { row: 4, col: 1, value: '41' }, { row: 4, col: 2, value: '42' },
          { row: 5, col: 0, value: '50'                         }, { row: 5, col: 1, value: '51' }, { row: 5, col: 2, value: '52' },
        ],
        prop: 'row',
        index: 0,
        amount: -2,
        expected: [
          { row: 0, col: 0, value: '20', rowspan: 2, colspan: 2 }, { row: 0, col: 1, value: '21' }, { row: 0, col: 2, value: '22' },
          { row: 1, col: 0, value: '30'                         }, { row: 1, col: 1, value: '31' }, { row: 1, col: 2, value: '32' },
          { row: 2, col: 0, value: '40'                         }, { row: 2, col: 1, value: '41' }, { row: 2, col: 2, value: '42' },
          { row: 3, col: 0, value: '50'                         }, { row: 3, col: 1, value: '51' }, { row: 3, col: 2, value: '52' },
        ]
      },
      {
        when: 'removing some rows one of them being at the end of a merged cell',
        then: 'recalculates merged area size',
        cells: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 3, colspan: 3 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20'                         }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
          { row: 3, col: 0, value: '30'                         }, { row: 3, col: 1, value: '31' }, { row: 3, col: 2, value: '32' },
          { row: 4, col: 0, value: '40'                         }, { row: 4, col: 1, value: '41' }, { row: 4, col: 2, value: '42' },
          { row: 5, col: 0, value: '50'                         }, { row: 5, col: 1, value: '51' }, { row: 5, col: 2, value: '52' },
        ],
        prop: 'row',
        index: 3,
        amount: -2,
        expected: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 2, colspan: 3 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20'                         }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
          { row: 3, col: 0, value: '50'                         }, { row: 3, col: 1, value: '51' }, { row: 3, col: 2, value: '52' },
        ]
      },
      {
        when: 'removing some rows some of them being at the end of a merged cell',
        then: 'recalculates merged area size',
        cells: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 4, colspan: 3 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20'                         }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
          { row: 3, col: 0, value: '30'                         }, { row: 3, col: 1, value: '31' }, { row: 3, col: 2, value: '32' },
          { row: 4, col: 0, value: '40'                         }, { row: 4, col: 1, value: '41' }, { row: 4, col: 2, value: '42' },
          { row: 5, col: 0, value: '50'                         }, { row: 5, col: 1, value: '51' }, { row: 5, col: 2, value: '52' },
        ],
        prop: 'row',
        index: 3,
        amount: -3,
        expected: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 2, colspan: 3 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20'                         }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
        ]
      },
      {
        when: 'removing some rows in the middle of a merged cell',
        then: 'recalculates merged area size',
        cells: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 4, colspan: 3 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '20'                         }, { row: 2, col: 1, value: '21' }, { row: 2, col: 2, value: '22' },
          { row: 3, col: 0, value: '30'                         }, { row: 3, col: 1, value: '31' }, { row: 3, col: 2, value: '32' },
          { row: 4, col: 0, value: '40'                         }, { row: 4, col: 1, value: '41' }, { row: 4, col: 2, value: '42' },
          { row: 5, col: 0, value: '50'                         }, { row: 5, col: 1, value: '51' }, { row: 5, col: 2, value: '52' },
        ],
        prop: 'row',
        index: 2,
        amount: -2,
        expected: [
          { row: 0, col: 0, value: '00'                         }, { row: 0, col: 1, value: '01' }, { row: 0, col: 2, value: '02' },
          { row: 1, col: 0, value: '10', rowspan: 2, colspan: 3 }, { row: 1, col: 1, value: '11' }, { row: 1, col: 2, value: '12' },
          { row: 2, col: 0, value: '40'                         }, { row: 2, col: 1, value: '41' }, { row: 2, col: 2, value: '42' },
          { row: 3, col: 0, value: '50'                         }, { row: 3, col: 1, value: '51' }, { row: 3, col: 2, value: '52' },
        ]
      },
    ]

    SAMPLES.forEach(sample => {
      it(`when ${sample.when} then ${sample.then}`, () => {
        const result = reallocate(sample.cells, sample.prop, sample.index, sample.amount)
        expect(result).toEqual(sample.expected)
      })
    })

  })
})