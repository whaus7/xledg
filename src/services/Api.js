import apisauce from 'apisauce';
//import urlencode from 'urlencode';
//import { createFormStringFromObject } from './helpers.js';
// import qs from 'qs';

/* ====================================
* Create and configure an apisauce-based api object.
*/
const create = (baseURL = 'https://data.ripple.com/v2/') => {
   const api = apisauce.create({
      // base URL is read from the "constructor"
      baseURL,
      timeout: 60000
   });

   /* ====================================
	* Assets
	*/
   const getGateways = () => {
      // let data = formData;
      //console.log('formData', formData);

      //let assetPath = AssetTypes[assetType.toUpperCase()]['url'];

      //let formString = qs.stringify(formData);

      return api.get(`gateways`, '');
   };

   return {
      // a list of the API functions
      getGateways
   };
};

// let's return back our create method as the default.
export default {
   create
};
