import * as imageConversion from 'image-conversion'

// 默认图片最大为150KB
export const useBeforeReadFile = async (file, maxKiloBytes = 150) => {
  const maxSize = maxKiloBytes * 1024
  if (file.size > maxSize) {
    const compressedFile = await useCompressFile(file, maxKiloBytes)
    return new Promise((resolve, reject) => resolve(compressedFile))
  } else {
    return new Promise((resolve, reject) => resolve(file))
  }
}

export const useBeforeReadMultiFile = async (file, maxKiloBytes = 150) => {
  const maxSize = maxKiloBytes * 1024
  if (Array.isArray(file)) {
    let compressedFileArray = []
    //同时上传多张图片时,file为文件数组
    for (const item of file) {
      if (item.size > maxSize) {
        const compressedFile = await useCompressFile(item, maxKiloBytes)
        compressedFileArray.push(compressedFile)
      } else {
        compressedFileArray.push(item)
      }
    }
    console.log(compressedFileArray)
    return new Promise((resolve, reject) => resolve(compressedFileArray))
  } else {
    return useBeforeReadFile(file, maxKiloBytes)
  }
}

export const useCompressFile = async (file, maxKiloBytes) => {
  showLoadingToast({
    message: '图片压缩中',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })
  // 超过maxKiloBytes kB的图片均会被压缩
  let res = await imageConversion.compressAccurately(file, maxKiloBytes)
  res = new File([res], file.name, { type: res.type, lastModified: Date.now() })
  console.log(res)
  closeToast()
  return res
}
