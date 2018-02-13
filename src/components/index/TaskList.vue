<template>
  <div id="task-list">
    <div class="table">
      <Table stripe border highlight-row :columns="table.columns" :data="table.tasks" size="large"></Table>
    </div>
    <div class="page">
      <Page :total="page.total" :page-size="page.pageSize" :current="page.page" show-total show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </div>
    <div class="refresh">
      <Button type="success" size="large" long @click="refresh">刷新</Button>
    </div>

    <Modal
    title="生成头像墙"
    v-model="imageDialog.show"
    :mask-closable="false">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>头像墙查看</span>

      </p>
      <div class="desc">
        <p><b>头像墙需要先生成才能查看，生成的时候可以配置各项参数。</b></p>
        <p><b>如果是宽度高度较大的头像墙图片，受限于服务器配置以及使用人数，生成头像墙图片有可能需要很长时间，请耐心等候。</b></p>
      </div>

      <Form :model="imageDialog.formItem" label-position="top" class="add-task">
        <FormItem label="生成头像墙宽度">
          <Slider v-model="imageDialog.formItem.width" show-stops show-input :min="1" :max="100"></Slider>
        </FormItem>
        <FormItem label="生成头像墙高度">
          <Slider v-model="imageDialog.formItem.height" show-stops show-input :min="1" :max="100"></Slider>
        </FormItem>
        <FormItem label="输出图片格式">
          <Select v-model="imageDialog.formItem.outputType" style="width:300px">
            <Option value="1" disabled>BMP</Option>
            <Option value="2">GIF（不推荐，画质较差）</Option>
            <Option value="3">JPG（强烈推荐，画质较好，文件小）</Option>
            <Option value="4">PNG（推荐，画质最好）</Option>
          </Select>
        </FormItem>
        <FormItem label="验证码">
          <img :src="imageDialog.verify_code_url" alt="">
          <Input v-model="imageDialog.formItem.verify_code" placeholder="请输入验证码..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="generate">生成图片</Button>
        <Button type="success" size="large" @click="showImage">查看图片</Button>
        <Button type="" size="large" @click="cancel">取消</Button>
      </div>
    </Modal>

    <!-- <Modal
    title="生成头像墙"
    v-model="imageDialog.show"
    :mask-closable="false"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="imageDialog.formItem" label-position="top" class="add-task">
      <FormItem label="生成头像墙宽度">
        <Slider v-model="imageDialog.formItem.width" show-stops show-input :min="1" :max="100"></Slider>
      </FormItem>
      <FormItem label="生成头像墙高度">
        <Slider v-model="imageDialog.formItem.height" show-stops show-input :min="1" :max="100"></Slider>
      </FormItem>
      <FormItem label="输出图片格式">
        <Select v-model="imageDialog.formItem.outputType" style="width:200px">
          <Option value="1" disabled>BMP</Option>
          <Option value="2">GIF</Option>
          <Option value="3">JPG</Option>
          <Option value="4">PNG</Option>
        </Select>
      </FormItem>
    </Form>
      </Modal> -->

  <Modal
  v-model="deleteDialog.show"
  title="删除抓取任务">
  <p>
    如果要删除，请说明情况并发送邮件至 867597730@qq.com
  </p>
</Modal>

<Modal
v-model="downDialog.show"
title="打包下载头像">
<p>
  功能开发中，请持续关注该开源项目的仓库<a href="https://github.com/tieba-show">https://github.com/tieba-show</a>，欢迎点Star。
</p>
</Modal>
</div>
</template>

<style scoped>
  .table {
    margin-bottom: 20px;
  }
  .page {
    width: 600px;
    margin: 20px auto;
  }
  .url {
    margin-bottom: 10px;
  }
  .desc {
    margin: 10px;
  }
</style>

<script>
  export default {
    name: 'TaskList',
    data () {
      return {
        table: {
          columns: [
          /*{
            title: '任务ID',
            key: 'uid',
            render: (h, params) => {
              return h('strong', ' ' + params.row.uid)
            }
          },*/
          {
            title: '贴吧名字',
            key: 'forum_name',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', ' ' + params.row.forum_name)
                ])
            }
          },
          {
            title: '起始页数',
            key: 'start_page',
          },
          {
            title: '结束页数',
            key: 'end_page',
          },
          {
            title: '总共页数',
            key: 'page_number',
          },
          /*{
            title: '宽度',
            key: 'width'
          },
          {
            title: '高度',
            key: 'height'
          },*/
          {
            title: '总数量',
            key: 'image_number',
          },
          {
            title: '任务创建时间',
            key: 'create_time',
            // width: 150,
          },
          {
            title: '任务开始时间',
            key: 'start_time',
            // width: 150,
          },
          {
            title: '任务完成时间',
            key: 'end_time',
            // width: 150,
          },
          {
            title: '任务耗时',
            key: 'spend_time'
          },
          {
            title: '任务状态',
            key: 'status'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showImageDialog(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.download(params.index)
                    }
                  },
                  style: {
                    marginRight: '5px'
                  },
                }, '下载'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
                ])
            }
          }
          ],
          tasks: [],
        },
        page: {
          total: 0,
          pageSize: 10,
          page: 1,
          last: -1,
        },
        deleteDialog: {
          show: false,
          // loading: true
        },
        imageDialog: {
          show: false,
          // loading: true
          url: '',
          formItem: {
            width: '4',
            height: '5',
            outputType: '4',
            forum_name: '',
            token: '',
            verify_code: '',
          },
          verify_code_url: '',
        },
        downDialog: {
          show: false,
        },
      }
    },
    methods: {
    /*rowClassName (row, index) {
      if (index === 1) {
          return 'demo-table-info-row';
      } else if (index === 3) {
          return 'demo-table-error-row';
      }
      return '';
    },*/
    /*showError(response) {
      let errorNo = response.data.errorno
      if (errorNo) {
        let errorMsg = response.data.errormsg
        this.$Message.error({
          content: errorMsg,
          duration: 3,
        })
      }
    },*/
    remove(index) {
      this.deleteDialog.show = true
      // setTimeout(() => {
      //     this.deleteDialog.show = false
      // }, 2000)
    },
    showImageDialog(index) {
      this.imageDialog.show = true
      this.imageDialog.formItem.forum_name = this.table.tasks[index].forum_name
      // this.imageDialog.url = this.$config.serverPath + path
      // console.log(path)
      // this.imageDialog.show = true
      // alert(1)
      let vue = this
      this.$http.get(vue.$config.serverPath + 'index.php?action=get_token', {
        params: {}
      })
      .then(function (response) {
        console.log(response)
        vue.$helper.showErrorMsg(vue, response)
        vue.imageDialog.formItem.token = response.data.data
        vue.imageDialog.verify_code_url = vue.$config.serverPath + 'index.php?action=verify_code&token=' + response.data.data
      })
      .catch(function (response) {
        console.log(response)
        vue.$helper.showServerError(vue, response)
      })
    },
    download() {
      this.downDialog.show = true
    },
    generate() {
      // let url = $config.serverPath + 'index.php?action=show_image&forum_name=' + ''
      let vue = this
      let formItem = this.imageDialog.formItem
      this.$Message.success({
        content: '正在生成图片中，请稍后查看',
        duration: 5,
      })
      // vue.$helper.showErrorMsg(vue, response, '正在生成图片中，请稍后查看')
      vue.imageDialog.show = false
      this.$http.get(vue.$config.serverPath + 'index.php?action=generate_image', {
        params: {
          forum_name: formItem.forum_name,
          width: formItem.width,
          height: formItem.height,
          output_type: formItem.outputType,
          token: formItem.token,
          verify_code: formItem.verify_code,
        }
      })
      .then(function (response) {
        console.log(response)
        // vue.$helper.showErrorMsg(vue, response, '正在生成图片中，请稍后查看')
        // vue.imageDialog.show = false
      })
      .catch(function (response) {
        console.log(response)
        // vue.$helper.showServerError(vue, response)
      })
      // this.imageDialog.formItem.forum_name = ''
      // this.imageDialog.formItem.forum_name = ''
    },
    showImage() {
      // let url = $config.serverPath + 'index.php?action=show_image&forum_name=' + ''
      let vue = this
      let formItem = this.imageDialog.formItem
      let random = Math.random()
      // 检查exist字段是否为true
      this.$http.get(vue.$config.serverPath + 'index.php?action=show_image', {
        params: {
          forum_name: formItem.forum_name,
          width: formItem.width,
          height: formItem.height,
          output_type: formItem.outputType,
        }
      })
      .then(function (response) {
        console.log(response)
        console.log(response.data.data.exist)
        if (response.data.data.exist) {
          // let url = vue.$config.serverPath + `index.php?action=show_image&forum_name=${formItem.forum_name}&width=${formItem.width}&height=${formItem.height}&output_type=${formItem.outputType}&random=${random}`
          let url = vue.$config.serverPath + response.data.data.path
          window.open(url);
        } else {
          alert('图片尚未生成，请输入验证码之后点击生成按钮')
        }
      })
      .catch(function (response) {
        console.log(response)
        // vue.$helper.showServerError(vue, response)
      })
    },
    cancel() {
      this.imageDialog.show = false
      // alert('手机浏览器长按图片后在弹出菜单中直接保存，电脑端右键点击鼠标，在弹出菜单中保存图片即可。')
    },
    fetchTasks(pageNum=1) {
      let vue = this
      console.log('fetchTasks')
      // TODO:fetchTasks
      this.$http.get(vue.$config.serverPath + 'index.php?action=list', {
        params: {
          page_size: vue.page.pageSize,
          page: pageNum,
          last: vue.page.last,
        }
      })
      .then(function (response) {
        console.log(response)
        vue.page.page = pageNum
        // vue.$helper.showErrorMsg(vue, response)
        vue.table.tasks = response.data.data.tasks
        vue.page.total = response.data.data.count
      })
      .catch(function (response) {
        console.log(response)
        // vue.$helper.showServerError(vue, response)
      })
    },
    refresh() {
      this.fetchTasks()
    },
    changePage(newPage) {
      console.log(newPage)
      this.fetchTasks(newPage)
    },
    changePageSize(newSize) {
      console.log(newSize)
      this.page.pageSize = newSize
      this.fetchTasks(this.page.newPage)
    },
  },
  mounted() {
    this.fetchTasks()
  },
}
</script>
