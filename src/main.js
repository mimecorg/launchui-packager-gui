import Vue from 'vuido'

import FileInput from './components/FileInput'
import FormGroup from './components/FormGroup'
import MainWindow from './MainWindow'

Vue.component( 'FileInput', FileInput );
Vue.component( 'FormGroup', FormGroup );

const window = new Vue( {
  render: h => h( MainWindow )
} );

window.$start();
