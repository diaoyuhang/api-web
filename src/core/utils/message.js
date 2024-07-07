import { message } from "antd"


const successNotice = (msg) => {
  message.info(msg).then(r => {

  })
}

const errorNotice = (msg) => {
  message.error(msg).then(r => {
  })
}

export {
  successNotice,
  errorNotice
}
