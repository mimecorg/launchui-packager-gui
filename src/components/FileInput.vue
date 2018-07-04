<template>
  <Box v-bind:label="label" horizontal padded>
    <TextInput stretchy v-bind:value="value" v-bind:enabled="enabled" v-on:input="input"/>
    <Button v-bind:enabled="enabled" v-on:click="choose">Choose...</Button>
  </Box>
</template>

<script>
import libui from 'libui-node'
import path from 'path'

export default {
  props: {
    label: String,
    value: String,
    enabled: {
      type: Boolean,
      default: true
    },
    dirPath: String
  },
  methods: {
    input( value ) {
      this.$emit( 'input', value );
    },
    choose() {
      const filePath = libui.UiDialogs.openFile( this.$root.$el.window );
      if ( filePath == null )
        return;
      if ( this.dirPath != null && filePath.substr( 0, this.dirPath.length ) == this.dirPath ) {
        const relativePath = path.relative( this.dirPath, filePath );
        if ( path.sep == '/' )
          this.input( relativePath );
        else
          this.input( relativePath.replace( /\\/g, '/' ) );
      } else {
        this.input( filePath );
      }
    }
  }
}
</script>
