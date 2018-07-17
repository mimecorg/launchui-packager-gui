<template>
  <Window title="LaunchUI Packager GUI" width="800" height="500" margined v-on:close="exit">
    <Box padded>
      <Group title="Project" margined>
        <Box padded>
          <Box horizontal padded>
            <TextInput stretchy readonly v-bind:value="dirPath"/>
            <Button v-bind:enabled="!isBuilding" v-on:click="openProject">Open Project...</Button>
            <Button v-bind:enabled="isEnabled && !isBuilding" v-on:click="saveProject">Save Project</Button>
          </Box>
          <Text>{{ projectStatus }}</Text>
        </Box>
      </Group>
      <Tab stretchy margined>
        <Box label="General" padded>
          <FormGroup title="Input">
            <TextInput label="Package name:" v-bind:enabled="isEnabled" v-model="options.name"/>
            <TextInput label="Package version:" v-bind:enabled="isEnabled" v-model="version"/>
            <FileInput label="Entry script:" v-bind:enabled="isEnabled" v-bind:dir-path="dirPath" v-model="options.entry"/>
          </FormGroup>
          <FormGroup title="Output">
            <TextInput label="Output location:" v-bind:enabled="isEnabled" v-model="options.out"/>
            <DropdownList label="Package format:" v-bind:items="[ 'No package', 'ZIP archive' ]" v-bind:enabled="isEnabled" v-model="packIndex"/>
            <Checkbox v-bind:enabled="isEnabled" v-model="options.overwrite">Overwrite output package</Checkbox>
          </FormGroup>
          <FormGroup title="Target">
            <DropdownList label="Platform:" v-bind:items="[ 'Windows', 'OS X', 'Linux' ]" v-bind:enabled="isEnabled" v-model="platformIndex"/>
            <DropdownList label="Architecture:" v-bind:items="[ 'ia32', 'x64' ]" v-bind:enabled="isEnabled" v-model="archIndex"/>
          </FormGroup>
        </Box>
        <Box label="Branding" padded>
          <FormGroup title="Resources">
            <TextInput label="Company name:" v-bind:enabled="isEnabled" v-model="options.company"/>
            <TextInput label="Copyright:" v-bind:enabled="isEnabled" v-model="options.copyright"/>
          </FormGroup>
          <FormGroup title="Icons">
            <FileInput label="Windows icon:" v-bind:enabled="isEnabled" v-bind:dir-path="dirPath" v-model="options.icon.win32"/>
            <FileInput label="OS X icon:" v-bind:enabled="isEnabled" v-bind:dir-path="dirPath" v-model="options.icon.darwin"/>
          </FormGroup>
          <FormGroup title="License">
            <FileInput label="License file:" v-bind:enabled="isEnabled" v-bind:dir-path="dirPath" v-model="options.license"/>
          </FormGroup>
          <FormGroup title="OS X Bundle">
            <TextInput label="Bundle identifier:" v-bind:enabled="isEnabled" v-model="options.identifier"/>
            <TextInput label="Application category:" v-bind:enabled="isEnabled" v-model="options.category"/>
          </FormGroup>
        </Box>
        <Box label="Advanced" padded>
          <FormGroup title="Additional Files">
            <TextInput label="Source directory:" v-bind:enabled="isEnabled" v-model="options.dir"/>
            <TextInput label="File patterns:" v-bind:enabled="isEnabled" v-model="options.files"/>
          </FormGroup>
          <FormGroup title="LaunchUI Settings">
            <TextInput label="Version:" v-bind:enabled="isEnabled" v-model="options.launchui.version"/>
            <TextInput label="Cache location:" v-bind:enabled="isEnabled" v-model="options.launchui.cache"/>
          </FormGroup>
        </Box>
      </Tab>
      <Group title="Package" margined>
        <Box padded>
          <Box horizontal padded>
            <ProgressBar stretchy v-bind:value="progress"/>
            <Button v-bind:enabled="canBuild" v-on:click="buildPackage">Build Package</Button>
          </Box>
          <Text>{{ packageStatus }}</Text>
        </Box>
      </Group>
    </Box>
  </Window>
</template>

<script>
import fs from 'fs'
import libui from 'libui-node'
import packager from 'launchui-packager'
import path from 'path'

import { getDefaultOptions, areOptionsEqual, cloneOptions, toPackagerOptions } from './options'
import { openProject, saveProject } from './project'

const packFormats = [ '', 'zip' ];
const platforms = [ 'win32', 'darwin', 'linux' ];
const archs = [ 'ia32', 'x64' ];

export default {
  data() {
    return {
      dirPath: '',
      options: getDefaultOptions(),
      savedOptions: null,
      version: '',
      platform: process.platform,
      arch: process.arch,
      isBuilding: false,
      buildError: null,
      buildResult: null
    };
  },
  computed: {
    isEnabled() {
      return this.dirPath != '' && !this.isBuilding;
    },
    canBuild() {
      return this.isEnabled && this.options.name != '' && this.version != '' && this.options.entry != '';
    },
    projectStatus() {
      if ( !this.isEnabled )
        return 'Select a package.json or launchui.json file to open.';
      else if ( this.savedOptions == null )
        return 'Warning: This project is not saved yet.';
      else if ( !areOptionsEqual( this.options, this.savedOptions ) )
        return 'Warning: This project contains unsaved changes.';
      else
        return 'This project is up to date.';
    },
    packageStatus() {
      if ( this.dirPath == '' )
        return 'Open a project to build the package.';
      else if ( this.options.name == '' )
        return 'Missing package name.';
      else if ( this.version == '' )
        return 'Missing package version.';
      else if ( this.options.entry == '' )
        return 'Missing entry script.';
      else if ( this.isBuilding )
        return 'Building package...';
      else if ( this.buildError != null )
        return 'Error: ' + this.buildError;
      else if ( this.buildResult != null )
        return 'Package built successfully: ' + this.buildResult;
      else
        return 'Ready to build the package.';
    },
    packIndex: {
      get() {
        return packFormats.indexOf( this.options.pack );
      },
      set( index ) {
        this.options.pack = packFormats[ index ];
      }
    },
    platformIndex: {
      get() {
        return platforms.indexOf( this.platform );
      },
      set( index ) {
        this.platform = platforms[ index ];
      }
    },
    archIndex: {
      get() {
        return archs.indexOf( this.arch );
      },
      set( index ) {
        this.arch = archs[ index ];
      }
    },
    progress() {
      return this.isBuilding ? -1 : 0;
    }
  },
  methods: {
    openProject() {
      const filePath = libui.UiDialogs.openFile( this.$el.window );
      if ( filePath == null )
        return;

      const name = path.basename( filePath );
      if ( name != 'package.json' && name != 'launchui.json' ) {
        libui.UiDialogs.msgBox( this.$el.window, 'Invalid file selected', 'Please select a package.json file or a launchui.json file.' );
        return;
      }

      const dirPath = path.dirname( filePath );

      let project;
      try {
        project = openProject( dirPath );
      } catch ( error ) {
        libui.UiDialogs.msgBoxError( this.$el.window, 'Open failed', 'The selected project could not be opened.' );
        return;
      }

      this.dirPath = dirPath;
      this.options = project.options;
      this.savedOptions = project.savedOptions;
      this.version = project.version;
      this.buildError = null;
      this.buildResult = null;
    },
    saveProject() {
      try {
        saveProject( this.dirPath, this.options );
      } catch ( error ) {
        libui.UiDialogs.msgBoxError( this.$el.window, 'Save failed', 'The current project could not be saved.' );
        return;
      }
      this.savedOptions = cloneOptions( this.options );
    },
    buildPackage() {
      process.chdir( this.dirPath );

      const dirName = this.options.name + '-v' + this.version + '-' + this.platform + '-' + this.arch;
      const zipName = dirName + '.zip';

      if ( !this.options.overwrite ) {
        const targetPath = path.resolve( this.options.out );
        const dirPath = path.join( targetPath, dirName );
        const zipPath = path.join( targetPath, zipName );
        if ( fs.existsSync( dirPath ) ) {
          libui.UiDialogs.msgBox( this.$el.window, 'Output exists', 'The package directory already exists. Select the "Overwrite output package" option to replace it.' );
          return;
        }
        if ( this.options.pack == 'zip' && fs.existsSync( zipPath ) ) {
          libui.UiDialogs.msgBox( this.$el.window, 'Output exists', 'The package ZIP file already exists. Select the "Overwrite output package" option to replace it.' );
          return;
        }
      }

      const options = toPackagerOptions( this.options, this.version, this.platform, this.arch );

      this.isBuilding = true;
      this.buildError = null;
      this.buildResult = null;

      packager( options, ( err, outPath ) => {
        this.isBuilding = false;
        if ( err != null )
          this.buildError = err.message;
        else if ( this.options.pack == 'zip' )
          this.buildResult = zipName;
        else
          this.buildResult = dirName;
      } );
    },
    exit() {
      libui.stopLoop();
    }
  }
}
</script>
