export function getDefaultOptions() {
  return {
    name: '',
    entry: '',
    out: '',
    pack: '',
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
    dir: '',
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

export function toPackagerOptions( options, version, platform, arch ) {
  const result = {
    name: options.name,
    version: version,
    entry: options.entry,
    platform: platform,
    arch: arch,
    overwrite: options.overwrite,
    launchuiOpts: {}
  };
  if ( options.out != '' )
    result.out = options.out;
  if ( options.pack != '' )
    result.pack = options.pack;
  if ( options.launchui.version != '' )
    result.launchuiOpts.version = options.launchui.version;
  if ( options.launchui.cache != '' )
    result.launchuiOpts.cache = options.launchui.cache;
  if ( options.company != '' )
    result.company = options.company;
  if ( options.copyright != '' )
    result.copyright = options.copyright;
  if ( options.identifier != '' )
    result.identifier = options.identifier;
  if ( options.category != '' )
    result.category = options.category;
  if ( options.icon[ arch ] != undefined && options.icon[ arch ] != '' )
    result.icon = options.icon[ arch ];
  if ( options.license != '' )
    result.license = options.license;
  if ( options.dir != '' )
    result.dir = options.dir;
  if ( options.files != '' )
    result.files = options.files;
  return result;
}
