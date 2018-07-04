<template>
  <Box v-bind:label="label" horizontal padded>
    <TextInput stretchy v-bind:value="value" v-bind:enabled="enabled" v-on:input="input"/>
    <Button v-bind:enabled="enabled">Choose...</Button>
  </Box>
</template>

<script>
export default {
  props: {
    label: String,
    value: String,
    enabled: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    input( value ) {
      this.$emit( 'input', value );
    }
  }
}
</script>
