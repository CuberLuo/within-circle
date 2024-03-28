<template>
  <EmptyError v-if="contact.length == 0" description="暂无任何消息" />
  <div v-else>
    <div v-for="(item, index) in contact" :key="index">
      <van-swipe-cell :name="index" ref="swipeCell" class="swipeCell">
        <van-cell center class="contact-cell" @click="goToChat(item)">
          <template #title>
            <div class="img-container" style="display: inline-block">
              <van-image round class="contact-img" :src="item.avatar_src" />
            </div>

            <div class="contact-info">
              <div class="contact-title">
                {{ item.title }}
                <div class="tag-block" v-if="item.title === '客服小助手'">
                  <van-tag type="success">官方</van-tag>
                </div>
              </div>
              <div class="contact-detail">{{ item.detail }}</div>
            </div>
          </template>
          <template #value>
            <div class="contact-time">{{ item.latest_time }}</div>
            <div v-if="item.msg_num !== 0">
              <van-badge :content="item.msg_num" style="margin-right: 12px">
                <div></div>
              </van-badge>
            </div>
          </template>
        </van-cell>
        <template #right>
          <van-button
            square
            type="danger"
            text="删除"
            class="delete-button"
            @click="deleteContactItem(index, item)"
          />
        </template>
      </van-swipe-cell>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'message'
})
const contact = ref(getItem('contactList') || [])

const swipeCell = ref()

const deleteContactItem = (index, item) => {
  const contactList = getItem('contactList')
  contactList.splice(index, 1)
  contact.value.splice(index, 1)
  setItem('contactList', contactList)
  // 清空聊天记录
  let chatHistory = getItem('chatHistoty')
  chatHistory[item.userId] = []
  setItem('chatHistoty', chatHistory)
}

const goToChat = (item) => {
  router.push({
    path: '/chat',
    query: {
      chatUserId: item.userId,
      chatUsername: item.title,
      chatUserAvatar: item.avatar_src,
      type: 'private'
    }
  })
}
</script>

<style scoped>
.contact-cell {
  display: flex;
  border-bottom: 1px solid #dee1e6;
}

.contact-img {
  width: 45px;
  height: 45px;
}

.contact-info {
  display: inline-block;
  margin-left: 10px;
}

.contact-title {
  font-size: 14px;
}

.contact-detail {
  width: 100px;
  white-space: nowrap; /* 文本不换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略号 */
}

.contact-detail,
.contact-time {
  font-size: 12px;
  color: #999;
}

.delete-button {
  height: 100%;
}
.tag-block {
  display: inline-block;
}
:deep().van-cell__title,
.van-cell__value {
  /* flex: auto; */
  display: flex;
  align-items: center;
}
</style>
