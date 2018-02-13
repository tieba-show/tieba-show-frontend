<style scoped>
  .add-task {
    padding: 20px;
  }
</style>

<template>
  <div id="search">
    <Button type="primary" icon="person-add" @click="add">添加任务</Button>
    <Modal
    title="添加抓取任务"
    v-model="show"
    :mask-closable="false"
    @on-ok="ok"
    @on-cancel="cancel">
      <p><b>在此处添加任务之后，等待服务器执行完取任务之后即可查看。</b></p>
      <Form :model="formItem" label-position="top" class="add-task"> <!-- :label-width="80" -->
        <FormItem label="贴吧名（请不要带“吧”字，比如说【李毅吧】只需要在此输入“李毅”即可 ）">
          <Input v-model="formItem.forumName" placeholder="请输入贴吧ID..."></Input>
        </FormItem>
        <FormItem label="抓取页面范围（每页20个ID，请注意计算数量）">
          <Slider v-model="formItem.page" show-stops show-input range :min="1" :max="500"></Slider>
        </FormItem>
        <!-- <FormItem label="生成头像墙宽度">
          <Slider v-model="formItem.width" show-stops show-input :min="1" :max="50"></Slider>
        </FormItem>
        <FormItem label="生成头像墙高度">
          <Slider v-model="formItem.height" show-stops show-input :min="1" :max="50"></Slider>
        </FormItem>
        <FormItem label="输出图片格式">
          <Select v-model="formItem.outputType" style="width:200px">
            <Option value="1" disabled>BMP</Option>
            <Option value="2">GIF</Option>
            <Option value="3">JPG</Option>
            <Option value="4">PNG</Option>
          </Select>
        </FormItem> -->
        <FormItem label="验证码">
          <img :src="verify_code_url" alt="">
          <Input v-model="formItem.verify_code" placeholder="请输入验证码..."></Input>
        </FormItem>
        <!-- <FormItem>
          <Button type="primary">Submit</Button>
          <Button type="ghost" style="margin-left: 8px">Cancel</Button>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'AddTask',
    data () {
      return {
        show: false,
        formItem: {
          forumName: '昌维',
          page: [1, 2],
          // width: 4,
          // height: 5,
          // outputType: '3',
          token: '',
          verify_code: '',
        },
        verify_code_url: '',
      }
    },
    methods: {
      add() {
        this.show = true
        let vue = this
        this.$http.get(vue.$config.serverPath + 'index.php?action=get_token', {
          params: {}
        })
        .then(function (response) {
          console.log(response)
          vue.$helper.showErrorMsg(vue, response)
          vue.formItem.token = response.data.data
          vue.verify_code_url = vue.$config.serverPath + 'index.php?action=verify_code&token=' + response.data.data
        })
        .catch(function (response) {
          console.log(response)
          vue.$helper.showServerError(vue, response)
        })
      },
      ok() {
        console.log('handleSubmit')
        let vue = this
        let formItem = this.formItem
        // TODO:fetchTasks
        this.$http.get(vue.$config.serverPath + 'index.php?action=add', {
          params: {
            forum_name: formItem.forumName,
            start_page: formItem.page[0],
            end_page: formItem.page[1],
            // width: formItem.width,
            // height: formItem.height,
            // output_type: formItem.outputType,
            token: formItem.token,
            verify_code: formItem.verify_code,
          }
        })
        .then(function (response) {
          console.log(response)
          vue.$helper.showErrorMsg(vue, response, '添加任务成功')
          vue.formItem.forumName = ''
          vue.formItem.verify_code = ''
        })
        .catch(function (response) {
          console.log(response)
          vue.$helper.showServerError(vue, response)
        })
      },
      cancel() {

      },
    }
  }
</script>
