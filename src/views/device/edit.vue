<template>
  <device-detail :is-edit="true" />
</template>

<script>
import DeviceDetail from './components/DeviceDetail'

export default {
  name: 'EditForm',
  components: { DeviceDetail }
}

</script>

