<template>
  <Window title="LaunchUI Packager GUI" width="800" height="500" margined v-on:close="exit">
    <Box padded>
      <Group title="Project" margined>
        <Box padded>
          <Box horizontal padded>
            <TextInput stretchy readonly v-bind:value="dirPath"/>
            <Button v-on:click="openProject">Open Project...</Button>
            <Button v-bind:enabled="isEnabled" v-on:click="saveProject">Save Project</Button>
          </Box>
          <Text>{{ projectStatus }}</Text>
        </Box>
      </Group>
      <Tab stretchy margined>
        <Box label="General" padded>
          <FormGroup title="Input">
            <TextInput label="Package name:" v-bind:enabled="isEnabled" v-model="options.name"/>
            <TextInput label="Package version:" v-bind:enabled="isEnabled" v-model="version"/>
            <FileInput label="Entry script:" v-bind:enabled="isEnabled" v-model="options.entry"/>
          </FormGroup>
          <FormGroup title="Output">
            <FileInput label="Output location:" v-bind:enabled="isEnabled" v-model="options.location"/>
            <DropdownList label="Package format:" v-bind:items="[ 'No package', 'ZIP archive' ]" v-bind:enabled="isEnabled" v-model="packageIndex"/>
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
            <FileInput label="Windows icon:" v-bind:enabled="isEnabled" v-model="options.icon.win32"/>
            <FileInput label="OS X icon:" v-bind:enabled="isEnabled" v-model="options.icon.darwin"/>
          </FormGroup>
          <FormGroup title="License">
            <FileInput label="License file:" v-bind:enabled="isEnabled" v-model="options.license"/>
          </FormGroup>
          <FormGroup title="OS X Bundle">
            <TextInput label="Bundle identifier:" v-bind:enabled="isEnabled" v-model="options.identifier"/>
            <TextInput label="Application category:" v-bind:enabled="isEnabled" v-model="options.category"/>
          </FormGroup>
        </Box>
        <Box label="Advanced" padded>
          <FormGroup title="Additional Files">
            <FileInput label="Source directory:" v-bind:enabled="isEnabled" v-model="options.directory"/>
            <TextInput label="File patterns:" v-bind:enabled="isEnabled" v-model="options.files"/>
          </FormGroup>
          <FormGroup title="LaunchUI Settings">
            <TextInput label="Version:" v-bind:enabled="isEnabled" v-model="options.launchui.version"/>
            <FileInput label="Cache location:" v-bind:enabled="isEnabled" v-model="options.launchui.cache"/>
          </FormGroup>
        </Box>
      </Tab>
      <Group title="Package" margined>
        <Box padded>
          <Box horizontal padded>
            <ProgressBar stretchy/>
            <Button v-bind:enabled="isEnabled">Build Package</Button>
          </Box>
          <Text>{{ packageStatus }}</Text>
        </Box>
      </Group>
    </Box>
  </Window>
</template>

<script>
import libui from 'libui-node'
import path from 'path'

import { getDefaultOptions, areOptionsEqual, cloneOptions } from './options'
import { openProject, saveProject } from './project'

const packages = [ '', 'zip' ];
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
      arch: process.arch
    };
  },
  computed: {
    isEnabled() {
      return this.dirPath != '';
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
      if ( !this.isEnabled )
        return 'Open a project to build the package.';
      else if ( this.options.name == '' )
        return 'Missing package name.';
      else if ( this.version == '' )
        return 'Missing package version.';
      else if ( this.options.entry == '' )
        return 'Missing entry script.';
      else
        return 'Ready to build the package.';
    },
    packageIndex: {
      get() {
        return packages.indexOf( this.options.package );
      },
      set( index ) {
        this.options.package = packages[ index ];
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
    exit() {
      libui.stopLoop();
    }
  }
}
</script>
