import * as axios from 'axios'
import moment from 'moment'
import { eventHub } from '@/utils/eventHub'

// Prod
axios.defaults.baseURL = process.env.PIPEU_API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = process.env.DEV_PIPEU_API_URL
}

console.log('['+moment().format('L HH:mm')+']' + 'axios.js plugin - setting * INITIAL axios.defaults.baseURL:', axios.defaults.baseURL)

// @!@!@!@!@! Big ISSUE Here, Node JS starts slowdown after a While using below Axios interceptors, the solution is to run the code just in the client side
export default ({ app, store, redirect }) => {

  if (process.client) {

    axios.interceptors.request.use(req => {
        // console.log('@ Axios interceptors request ', req.url)
        eventHub.$emit('before-request');
        return req;
      },
      error => {
        eventHub.$emit('request-error');
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(res => {
        eventHub.$emit('after-response');
        return res;
      },
      error => {
        // if (error.response.status === 401) {
        eventHub.$emit('response-error');
        return Promise.reject(error);
      }
    )

  }

}


