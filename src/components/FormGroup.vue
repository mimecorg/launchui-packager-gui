<template>
  <Group v-bind:title="title" margined>
    <Form padded>
      <slot/>
    </Form>
  </Group>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>
