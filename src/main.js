import libui from 'libui-node'
import Vue from 'vuido'

import FileInput from './components/FileInput'
import FormGroup from './components/FormGroup'
import MainWindow from './MainWindow'

Vue.component( 'FileInput', FileInput );
Vue.component( 'FormGroup', FormGroup );

const window = new Vue( {
  render: h => h( MainWindow )
} );

window.$mount();

libui.startLoop();
