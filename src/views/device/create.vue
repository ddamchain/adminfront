<template>
  <device-detail :is-edit="false" />
</template>

<script>
import DeviceDetail from './components/DeviceDetail'

export default {
  name: 'CreateForm',
  components: { DeviceDetail }
}

</script>

