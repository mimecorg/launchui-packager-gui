import fs from 'fs'
import path from 'path'

import { getDefaultOptions, cloneOptions } from './options'

export function openProject( dirPath ) {
  const packagePath = path.join( dirPath, 'package.json' );
  const projectPath = path.join( dirPath, 'launchui.json' );

  const packageBody = fs.readFileSync( packagePath, 'utf8' );
  const info = JSON.parse( packageBody );

  let options, savedOptions;
  if ( fs.existsSync( projectPath ) ) {
    const projectBody = fs.readFileSync( projectPath, 'utf8' );
    options = JSON.parse( projectBody );
    savedOptions = cloneOptions( options );
  } else {
    options = getDefaultOptions();
    initializeProject( dirPath, options, info );
  }

  return { options, savedOptions, version: info.version };
}

export function saveProject( dirPath, options ) {
  const projectPath = path.join( dirPath, 'launchui.json' );

  const body = JSON.stringify( options, null, 2 );
  fs.writeFileSync( projectPath, body, 'utf8' );
}

function initializeProject( dirPath, options, info ) {
  if ( info.productName != null )
    options.name = info.productName;
  else if ( info.name != null )
    options.name = info.name;

  if ( info.main != null )
    options.entry = info.main;

  if ( typeof info.author == 'string' )
    options.company = info.author;
  else if ( info.author != null && info.author.name != null )
    options.company = info.author.name;

  if ( fs.existsSync( path.join( dirPath, 'LICENSE' ) ) )
    options.license = 'LICENSE';
  else if ( fs.existsSync( path.join( dirPath, 'LICENCE' ) ) )
    options.license = 'LICENCE';
}
