import { createMuiTheme } from '@material-ui/core/styles';
import Noty from 'noty';

export function notification(msg) {
   new Noty({
      text: msg,
      theme: 'sunset',
      type: 'error',
      layout: 'top',
      timeout: 3000
   }).show();
}

// Bind in constructor
export function updateInput(e, field) {
   this.setState({ [field]: e.target.value });
}

// Bind in constructor
export function updateInputNumber(e, field) {
   this.setState({ [field]: parseInt(e.target.value) });
}

// Bind in constructor
export function updateInputToggle(e, field) {
   this.setState({
      [field]: e.target.checked
   });
}

// Bind in constructor
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

export const materialTheme = createMuiTheme({
   palette: {
      type: 'dark',
      primary: {
         main: '#21c2f8'
      }
   }
});
