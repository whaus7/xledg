import { createMuiTheme } from '@material-ui/core/styles';
import Noty from 'noty';

export function notification(msg, type) {
   new Noty({
      text: msg,
      theme: 'sunset',
      type: type,
      layout: 'top',
      timeout: 300000
   }).show();
}

// Input update helpers
// Bind in constructor
export function updateInput(e, field) {
   this.setState({ [field]: e.target.value });
}
export function updateInputNumber(e, field) {
   this.setState({ [field]: parseInt(e.target.value, 10) });
}
export function updateInputToggle(e, field) {
   this.setState({
      [field]: e.target.checked
   });
}
export function updateSelectBasic(e, field) {
   this.setState({ [field]: e });
}

export const groupBy = (items, key) =>
   items.reduce(
      (result, item) => ({
         ...result,
         [item[key]]: [...(result[item[key]] || []), item]
      }),
      {}
   );

export function importAll(r) {
   let images = {};
   r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
      return true;
   });
   return images;
}

export const materialTheme = createMuiTheme({
   palette: {
      type: 'dark',
      primary: {
         main: '#21c2f8'
      }
   }
});
