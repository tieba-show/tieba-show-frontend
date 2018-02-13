export default {
  showErrorMsg(vue, response, successMessage) {
    console.log(response)
    let error = response.data.error
    if (error.length != 0) {
      vue.$Message.error({
        content: error,
        duration: 5,
      })
    } else {
      vue.$Message.success({
        content: successMessage,
        duration: 5,
      })
    }
  },
  showServerError(vue, response) {
    console.log(response)
    vue.$Message.error({
      content: '从服务器获取数据出错，请检查您提交的参数是否有误，或者网络连接是否正常。',
      duration: 5,
    })
    // let errorNo = response.data.errorno
    // if (errorNo) {
    //   let errorMsg = response.data.errormsg
    //   vue.$Message.error({
    //     content: errorMsg,
    //     duration: 3,
    //   })
    // }
  },
  test() {
    console.log(1)
  },
  showMsg() {
    console.log(1)
  },
}