export function getDefaultOptions() {
  return {
    name: '',
    entry: '',
    location: '',
    package: '',
    overwrite: false,
    company: '',
    copyright: '',
    icon: {
      win32: '',
      darwin: ''
    },
    license: '',
    identifier: '',
    category: '',
    directory: '',
    files: '',
    launchui: {
      version: '',
      cache: ''
    }
  };
}

export function areOptionsEqual( options1, options2 ) {
  if ( typeof options1 == 'object' ) {
    for ( const key in options1 ) {
      if ( !areOptionsEqual( options1[ key ], options2[ key ] ) )
        return false;
    }
    return true;
  } else {
    return options1 === options2;
  }
}

export function cloneOptions( options ) {
  if ( typeof options == 'object' ) {
    const result = {};
    for ( const key in options )
      result[ key ] = cloneOptions( options[ key ] );
    return result;
  } else {
    return options;
  }
}
