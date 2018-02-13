<template>
  <div id="search">
    <Input v-model="value" size="large">
      <Select v-model="valueType" slot="prepend" style="width: 80px">
          <Option value="uid">用户名</Option>
          <Option value="username">Uid</Option>
      </Select>
      <Button slot="append" type="primary" icon="ios-search" @click="handleSubmit"></Button>
    </Input>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      value: '',
      valueType: ''
    }
  },
  methods: {
    handleSubmit() {
      console.log('submit', this.value, this.valueType)
    }
  }
}
</script>
