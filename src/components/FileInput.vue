<template>
  <Box v-bind:label="label" horizontal padded>
    <TextInput stretchy v-bind:enabled="enabled"/>
    <Button v-bind:enabled="enabled">Choose...</Button>
  </Box>
</template>

<script>
export default {
  props: {
    label: String,
    enabled: {
      type: Boolean,
      default: true
    }
  }
}
</script>
