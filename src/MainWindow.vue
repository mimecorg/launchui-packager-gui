<template>
  <Window title="LaunchUI Packager GUI" width="400" height="100" margined v-on:close="exit">
    <Box>
      <Text>Welcome to your Vuido application!</Text>
    </Box>
  </Window>
</template>

<script>
import libui from 'libui-node'

export default {
  methods: {
    exit() {
      libui.stopLoop();
    }
  }
}
</script>
