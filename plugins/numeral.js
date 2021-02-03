import Vue from 'vue'
import numeral from 'numeral'

try {
  numeral.register('locale', 'pt-br2', {
    delimiters: {
      thousands: '.',
      decimal: ','
    },
    abbreviations: {
      thousand: 'm',
      million: 'mm',
      billion: 'b',
      trillion: 't'
    },
    ordinal: function (number) {
      var b = number % 10
      return (~~(number % 100 / 10) === 1) ? 'th'
        : (b === 1) ? 'st'
          : (b === 2) ? 'nd'
            : (b === 3) ? 'rd' : 'th'
    },
    currency: {
      symbol: 'R$'
    }
  })
} catch (error) {
  console.log('### Numeral.js defined')
}

numeral.locale('pt-br2')

Vue.use(numeral)

export default numeral
