<template>
  <Window title="LaunchUI Packager GUI" width="800" height="500" margined v-on:close="exit">
    <Box padded>
      <Group title="Project" margined>
        <Box padded>
          <Box horizontal padded>
            <TextInput stretchy readonly v-bind:value="projectPath"/>
            <Button v-on:click="openProject">Open Project...</Button>
            <Button v-bind:enabled="isLoaded">Save Project</Button>
          </Box>
          <Text>Select a package.json file to create a new project or select an existing launchui.json project file to open.</Text>
        </Box>
      </Group>
      <Tab stretchy margined>
        <Box label="General" padded>
          <FormGroup title="Input">
            <TextInput label="Package name:" v-bind:enabled="isLoaded"/>
            <TextInput label="Package version:" v-bind:enabled="isLoaded"/>
            <FileInput label="Entry script:" v-bind:enabled="isLoaded"/>
          </FormGroup>
          <FormGroup title="Output">
            <FileInput label="Output location:" v-bind:enabled="isLoaded"/>
            <DropdownList label="Package format:" v-bind:items="[ 'No package', 'ZIP archive' ]" v-bind:enabled="isLoaded"/>
            <Checkbox v-bind:enabled="isLoaded">Overwrite output package</Checkbox>
          </FormGroup>
          <FormGroup title="Target">
            <DropdownList label="Platform:" v-bind:items="[ 'Windows', 'OS X', 'Linux' ]" v-bind:enabled="isLoaded"/>
            <DropdownList label="Architecture:" v-bind:items="[ 'ia32', 'x64' ]" v-bind:enabled="isLoaded"/>
          </FormGroup>
        </Box>
        <Box label="Branding" padded>
          <FormGroup title="Resources">
            <TextInput label="Company name:" v-bind:enabled="isLoaded"/>
            <TextInput label="Copyright:" v-bind:enabled="isLoaded"/>
          </FormGroup>
          <FormGroup title="Icons">
            <FileInput label="Windows icon:" v-bind:enabled="isLoaded"/>
            <FileInput label="OS X icon:" v-bind:enabled="isLoaded"/>
          </FormGroup>
          <FormGroup title="License">
            <FileInput label="License file:" v-bind:enabled="isLoaded"/>
          </FormGroup>
          <FormGroup title="OS X Bundle">
            <TextInput label="Bundle identifier:" v-bind:enabled="isLoaded"/>
            <TextInput label="Application category:" v-bind:enabled="isLoaded"/>
          </FormGroup>
        </Box>
        <Box label="Advanced" padded>
          <FormGroup title="Additional Files">
            <FileInput label="Source directory:" v-bind:enabled="isLoaded"/>
            <TextInput label="File patterns:" v-bind:enabled="isLoaded"/>
          </FormGroup>
          <FormGroup title="LaunchUI Settings">
            <TextInput label="Version:" v-bind:enabled="isLoaded"/>
            <FileInput label="Cache location:" v-bind:enabled="isLoaded"/>
          </FormGroup>
        </Box>
      </Tab>
      <Group title="Package" margined>
        <Box padded>
          <Box horizontal padded>
            <ProgressBar stretchy/>
            <Button v-bind:enabled="isLoaded">Build Package</Button>
          </Box>
          <Text>Open a project to build the package.</Text>
        </Box>
      </Group>
    </Box>
  </Window>
</template>

<script>
import libui from 'libui-node'

export default {
  data() {
    return {
      projectPath: '',
      isLoaded: false
    };
  },
  methods: {
    openProject() {
      this.projectPath = libui.UiDialogs.openFile( this.$el.window );
      this.isLoaded = true;
    },
    exit() {
      libui.stopLoop();
    }
  }
}
</script>
