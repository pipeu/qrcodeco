import numeral from 'numeral'
import moment from 'moment-timezone'

export default {
  data() {
    return {
      hideDevDebTrickCount: 0,
      hideDevDeb: false, // indicates if some developer activate hidden debug for developers using
      // TODO: Get Dynamic from store config
      defaultTimeZone: 'America/Sao_Paulo', // Default TimeZone for this App client session, used in default format functions.
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    }
  },

  created() {
  },

  mounted() {
    let vm = this
  },

  methods: {
    addCheckHideDevTrick () {
      this.hideDevDebTrickCount = this.hideDevDebTrickCount + 1
      if (this.hideDevDebTrickCount >= 10) {
        // TODO: we could put this in cookie for devs
        this.hideDevDeb = true
        console.log('%cDev Mode Enabled !!! :)', 'color: green; background: yellow; font-size: 24px; border: 1px solid red; text-shadow: 2px 2px black;padding: 10px;');
      }
    },

    deb(text, obj) {
      if (process.env.NODE_ENV === 'development' || this.hideDevDeb === true) {
        console.log(text, (obj ? '' + obj : ''))
      }
    },

    debH(text, obj) {
      if (process.env.NODE_ENV === 'development' || this.hideDevDeb === true) {
        console.log('%c' + text, 'color: blue; background: white; font-size: 16px;padding: 10px;', (obj ? '' + obj : ''))
      }
    },

    err(text, obj) {
      if (process.env.NODE_ENV === 'development' || this.hideDevDeb === true) {
        console.log('%c' + text, 'color: red; background: white; font-size: 16px;padding: 10px;', (obj ? '' + obj : ''))
      }
    },

    pTest(text, obj) {
      if (process.env.NODE_ENV === 'development' || this.hideDevDeb === true) {
        console.log('%cAttention, fixed for @Tests here ->' + text, 'color: red; background: white; font-size: 16px;padding: 10px;', (obj ? '' + obj : ''))
      }
    },

    // Without +xx international code
    formatPhoneNumberForDomesticUser(phone) {
      //normalize string and remove all unnecessary characters
      phone = phone.replace(/[^\d]/g, "");

      //check if number length equals to 13
      // 5511995356972
      if (phone.length == 13) { // 5511995356972
        //reformat and return phone number
        phone = phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "($2) $3-$4");
      }

      return phone;
    },

    // Without +xx international code
    formatPhoneNumberForInternationalUser(phone) {
      //normalize string and remove all unnecessary characters
      phone = phone.replace(/[^\d]/g, "");

      //check if number length equals to 13
      // 5511995356972
      if (phone.length == 13) { // 5511995356972
        //reformat and return phone number
        return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
      }

      return null;
    },

    formatAmount(amount) {
      return numeral(amount).format("0,0.00")
    },

    formatCurrency(value) {
      let number = new numeral(value)
      return number.format("$ 0,0.00")
    },

    truncateString (item, value) {
      if (item && item.length > value) {
        return item.substring(item, value) + '...'
      } else {
        return item
      }
    },

    trimText: function (text, size, moreTextSignal) {
      if (text && text.length > size) {
        return text + moreTextSignal
      } else {
        return text
      }
    },


    formatMonth (pdate) {
      return moment.tz(pdate, this.defaultTimeZone).format('MMM')
    },
    formatDay (pdate) {
      return moment.tz(pdate, this.defaultTimeZone).format('DD')
    },

    formatDateTimeWithZoneHHMM (value) {
      return moment.tz(value, this.defaultTimeZone).format('DD/MM/YYYY HH:mm')
    },

    formatDateWithZone (value) {
      return moment.tz(value, this.defaultTimeZone).format('DD/MM/YYYY')
    },

    formatDateWithZoneDDMMYYYY (value) {
      return moment.tz(value, this.defaultTimeZone).format('DD/MM/YYYY')
    },

    formatDateWithZoneFormat (value, frm) {
      return moment.tz(value, this.defaultTimeZone).format(frm);
    },

  }
}
